import nltk
from nltk.stem.porter import PorterStemmer
import numpy as np

stemmer = PorterStemmer()

nltk.download('punkt')
nltk.download('punkt_tab')

def tokenize(sentence):
  """
    divide la oración en un arreglo de palabras/tokens
    un token puede ser una palabra, un signo de puntuación o un número
  """
  return nltk.word_tokenize(sentence);

def stem(word):
  """
    stemming = encuentra la raíz de la palabra
    por ejemplo:
    words = ["organize", "organizes", "organizing"]
    words = [stem(w) for w in words]
    -> ["organ", "organ", "organ"]
  """
  return stemmer.stem(word.lower())

def bag_of_words(tokenized_sentece, all_words):
  """
    devuelve un arreglo de bag of words:
    1 para cada palabra conocida que exista en la oración, 0 en caso de que no
    por ejjemplo:
    sentence = ["hello", "how", "are", "you"]
    words = ["hi", "hello", "I", "you", "bye", "thank", "cool"]
    bog   = [  0 ,    1 ,    0 ,   1 ,    0 ,    0 ,      0]
  """
  tokenized_sentece = [stem(w) for w in tokenized_sentece]

  bag = np.zeros(len(all_words), dtype=np.float32)
  for idx, w in enumerate(all_words):
    if w in tokenized_sentece:
      bag[idx] = 1.0
  
  return bag




#words = ["Organize", "organizes", "organizing"]
#stemmed_words = [stem(w) for w in words]
#print(stemmed_words)