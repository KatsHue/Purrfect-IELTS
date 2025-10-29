import json
from nltk_utils import tokenize, stem, bag_of_words
import numpy as np
import torch 
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from model import NeuralNet
from sklearn.metrics import classification_report, confusion_matrix, precision_score, recall_score, f1_score, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split

with open('intents.json', 'r', encoding='utf-8') as f:
    intents = json.load(f)

all_words = []
tags = []
xy = []
for intent in intents['intents']:
    tag = intent['tag']
    tags.append(tag)
    for pattern in intent['patterns']:
        w = tokenize(pattern)
        all_words.extend(w)
        xy.append((w, tag))

ignore_words = ['?', '!', '.', ',', ';', '¿', '¡']
all_words = [stem(w) for w in all_words if w not in ignore_words]
all_words = sorted(set(all_words))
tags = sorted(set(tags))

X = []
y = []
for (pattern_sentence, tag) in xy:
    bag = bag_of_words(pattern_sentence, all_words)
    X.append(bag)
    label = tags.index(tag)
    y.append(label)

X = np.array(X)
y = np.array(y)

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print(f"Tamaño del conjunto de entrenamiento: {len(X_train)}")
print(f"Tamaño del conjunto de validación: {len(X_val)}")

class ChatDataset(Dataset):
    def __init__(self, X_data, y_data):
        self.n_samples = len(X_data)
        self.x_data = X_data
        self.y_data = y_data

    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    def __len__(self):
        return self.n_samples

batch_size = 8
hidden_size = 32
output_size = len(tags)
input_size = len(X_train[0])
learning_rate = 0.0005
num_epochs = 500

train_dataset = ChatDataset(X_train, y_train)
val_dataset = ChatDataset(X_val, y_val)

train_loader = DataLoader(dataset=train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
val_loader = DataLoader(dataset=val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = NeuralNet(input_size, hidden_size, output_size).to(device)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate, weight_decay=1e-3 )

train_losses = []
train_accuracies = []
val_losses = []
val_accuracies = []

best_loss = float('inf')
patience = 20
patience_counter = 0

# --- Entrenamiento ---
for epoch in range(num_epochs):
    model.train()
    epoch_train_loss = 0
    train_correct = 0
    train_total = 0
    for words, labels in train_loader:
        words = words.to(device)
        labels = labels.to(device)

        # forward
        outputs = model(words)
        loss = criterion(outputs, labels)

        # backward
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        epoch_train_loss += loss.item()
        _, predicted = torch.max(outputs, dim=1)
        train_total += labels.size(0)
        train_correct += (predicted == labels).sum().item()

    avg_train_loss = epoch_train_loss / len(train_loader)
    train_accuracy = train_correct / train_total

    model.eval()
    epoch_val_loss = 0
    val_correct = 0
    val_total = 0

    with torch.no_grad():
        for words, labels in val_loader:
            words = words.to(device)
            labels = labels.to(device)

            outputs = model(words)
            loss = criterion(outputs, labels)

            epoch_val_loss += loss.item()
            _, predicted = torch.max(outputs, dim=1)
            val_total += labels.size(0)
            val_correct += (predicted == labels).sum().item()

    avg_val_loss = epoch_val_loss / len(val_loader)
    val_accuracy = val_correct / val_total

    train_losses.append(avg_train_loss)
    train_accuracies.append(train_accuracy)
    val_losses.append(avg_val_loss)
    val_accuracies.append(val_accuracy)

    # Early stopping basado en pérdida de validación
    if avg_val_loss < best_loss:
        best_loss = avg_val_loss
        patience_counter = 0
    else:
        patience_counter += 1

    if patience_counter >= patience:
        print(f'Early stopping en época {epoch+1}')
        break

    if (epoch + 1) % 10 == 0:
      print(f'Época {epoch + 1}/{num_epochs}')
      print(f'  Train - AvgLoss: {avg_train_loss:.10f}, Accuracy: {train_accuracy:.10f}')
      print(f'  Val   - AvgLoss: {avg_val_loss:.10f}, Accuracy: {val_accuracy:.10f}')

# --- Evaluación final ---
model.eval()
train_true = []
train_pred = []

with torch.no_grad():
    for words, labels in train_loader:
        words = words.to(device)
        labels = labels.to(device)
        outputs = model(words)
        _, predicted = torch.max(outputs, dim=1)
        train_true.extend(labels.cpu().numpy())
        train_pred.extend(predicted.cpu().numpy())


val_true = []
val_pred = []

with torch.no_grad():
    for words, labels in val_loader:
        words = words.to(device)
        labels = labels.to(device)
        outputs = model(words)
        _, predicted = torch.max(outputs, dim=1)
        val_true.extend(labels.cpu().numpy())
        val_pred.extend(predicted.cpu().numpy())

labels_idx = list(range(len(tags)))

# Métricas para entrenamiento
train_accuracy = accuracy_score(train_true, train_pred)
train_precision = precision_score(train_true, train_pred, average='weighted', zero_division=0)
train_recall = recall_score(train_true, train_pred, average='weighted', zero_division=0)
train_f1 = f1_score(train_true, train_pred, average='weighted', zero_division=0)

# Métricas para validación
val_accuracy = accuracy_score(val_true, val_pred)
val_precision = precision_score(val_true, val_pred, average='weighted', zero_division=0)
val_recall = recall_score(val_true, val_pred, average='weighted', zero_division=0)
val_f1 = f1_score(val_true, val_pred, average='weighted', zero_division=0)

print("\n=== COMPARACIÓN DE MÉTRICAS ===")
print(f"{'Métrica':<12} {'Entrenamiento':<15} {'Validación':<15}")
print("-" * 45)
print(f"{'Accuracy':<12} {train_accuracy:<15.4f} {val_accuracy:<15.4f}")
print(f"{'Precision':<12} {train_precision:<15.4f} {val_precision:<15.4f}")
print(f"{'Recall':<12} {train_recall:<15.4f} {val_recall:<15.4f}")
print(f"{'F1-Score':<12} {train_f1:<15.4f} {val_f1:<15.4f}")

print("\n=== REPORTE DE CLASIFICACIÓN (VALIDACIÓN) ===")
print(classification_report(val_true, val_pred, labels=labels_idx, target_names=tags, zero_division=0))

# --- GRÁFICAS DE PÉRDIDA Y PRECISIÓN ---
plt.figure(figsize=(15, 5))

# Gráfica de pérdida
plt.subplot(1, 3, 1)
plt.plot(train_losses, label='Entrenamiento', linewidth=2)
plt.plot(val_losses, label='Validación', linewidth=2)
plt.xlabel('Épocas')
plt.ylabel('Pérdida')
plt.title('Evolución de la Pérdida')
plt.legend()
plt.grid(True, alpha=0.3)

# Gráfica de precisión
plt.subplot(1, 3, 2)
plt.plot(train_accuracies, label='Entrenamiento', linewidth=2)
plt.plot(val_accuracies, label='Validación', linewidth=2)
plt.xlabel('Épocas')
plt.ylabel('Precisión')
plt.title('Evolución de la Precisión')
plt.legend()
plt.grid(True, alpha=0.3)

# Gráfica de métricas finales
plt.subplot(1, 3, 3)
metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
train_metrics = [train_accuracy, train_precision, train_recall, train_f1]
val_metrics = [val_accuracy, val_precision, val_recall, val_f1]

x = np.arange(len(metrics))
width = 0.35

plt.bar(x - width/2, train_metrics, width, label='Entrenamiento', alpha=0.8)
plt.bar(x + width/2, val_metrics, width, label='Validación', alpha=0.8)

plt.xlabel('Métricas')
plt.ylabel('Valor')
plt.title('Comparación de Métricas Finales')
plt.xticks(x, metrics)
plt.legend()
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

# 1. Matriz de Confusión - ENTRENAMIENTO
plt.figure(figsize=(14, 10))
cm_train = confusion_matrix(train_true, train_pred, labels=labels_idx)
sns.heatmap(cm_train,
            annot=True,
            fmt='d',
            xticklabels=tags,
            yticklabels=tags,
            cmap='Blues',
            linewidths=0.5,
            linecolor='gray')
plt.xlabel("Predicted", fontsize=12, fontweight='bold')
plt.ylabel("Real", fontsize=12, fontweight='bold')
plt.title("Matriz de Confusión - Conjunto de Entrenamiento", fontsize=14, fontweight='bold')
plt.xticks(rotation=45, ha='right')
plt.yticks(rotation=0)
plt.tight_layout()
plt.show()

# 2. Matriz de Confusión - VALIDACIÓN
plt.figure(figsize=(14, 10))
cm_val = confusion_matrix(val_true, val_pred, labels=labels_idx)
sns.heatmap(cm_val,
            annot=True,
            fmt='d',
            xticklabels=tags,
            yticklabels=tags,
            cmap='Blues',
            linewidths=0.5,
            linecolor='gray')
plt.xlabel("Predicted", fontsize=12, fontweight='bold')
plt.ylabel("Real", fontsize=12, fontweight='bold')
plt.title("Matriz de Confusión - Conjunto de Validación", fontsize=14, fontweight='bold')
plt.xticks(rotation=45, ha='right')
plt.yticks(rotation=0)
plt.tight_layout()
plt.show()


data = {
    "model_state": model.state_dict(),
    "input_size": input_size,
    "hidden_size": hidden_size,
    "output_size": output_size,
    "all_words": all_words,
    "tags": tags,
    "metrics": {
        "train_accuracy": train_accuracy,
        "train_precision": train_precision,
        "train_recall": train_recall,
        "train_f1": train_f1,
        "val_accuracy": val_accuracy,
        "val_precision": val_precision,
        "val_recall": val_recall,
        "val_f1": val_f1
    }
}

# Resumen final
print("\n" + "="*60)
print("RESUMEN FINAL DEL ENTRENAMIENTO")
print("="*60)
print(f"Mejor época: {len(train_losses) - patience_counter}")
print(f"Mejor pérdida de validación: {best_loss:.6f}")
print(f"Precisión final en validación: {val_accuracy:.4f}")
print(f"Tamaño del vocabulario: {len(all_words)}")
print(f"Número de clases: {len(tags)}")

FILE = 'data.pth'
torch.save(data, FILE)
print(f'Training complete. File saved {FILE}')