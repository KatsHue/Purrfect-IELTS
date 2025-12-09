import torch
import torch.nn as nn

class NeuralNet(nn.Module):
  def __init__(self, input_size, hidden_size, num_classes):
    super(NeuralNet, self).__init__()
    self.l1 = nn.Linear(input_size, hidden_size)
    self.l2 = nn.Linear(hidden_size, num_classes)
    self.relu = nn.ReLU()
    self.dropout = nn.Dropout(0.5)
    self.bn1 = nn.BatchNorm1d(hidden_size)

    self._initialize_weights()

  def _initialize_weights(self):
    for m in self.modules():
      if isinstance(m, nn.Linear):
        nn.init.kaiming_uniform_(m.weight, nonlinearity='relu')
        nn.init.zeros_(m.bias)

  def forward(self, x):
    out = self.l1(x)
    out = self.bn1(out)
    out = self.relu(out)
    out = self.dropout(out)

    out = self.l2(out)

    return out