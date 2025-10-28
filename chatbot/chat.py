import random
import json
import torch
from model import NeuralNet
from nltk_utils import bag_of_words, tokenize

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open('intents.json', 'r', encoding='utf-8') as f:
    intents = json.load(f)

FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

def acentos(sentences):
    replacements = str.maketrans("áéíóúÁÉÍÓÚñÑ", "aeiouAEIOUnN")
    return sentences.translate(replacements)

bot_name = "Purry"
print("¡Purr, purr! Cuéntame tus dudas (escribe 'quit' para salir)")

def get_response(sentence):
  sentence = acentos(sentence)
  sentence = tokenize(sentence)
  X = bag_of_words(sentence, all_words)
  X = X.reshape(1, X.shape[0])
  X = torch.from_numpy(X).to(device)
  output = model(X)
  _, predicted = torch.max(output, dim=1)
  
  tag = tags[predicted.item()]

  probs = torch.softmax(output, dim=1)
  prob = probs[0][predicted.item()]
  
  if prob.item() > 0.75:
      for intent in intents['intents']:
          if tag == intent["tag"]:
              print(f"{bot_name}: {random.choice(intent['responses'])}")
              return random.choice(intent['responses'])
  else:
     print(f"{bot_name}: No estoy seguro de entenderte. ¿Puedes reformular tu pregunta?")
     return "No estoy seguro de entenderte. ¿Puedes reformular tu pregunta?"

    

    
