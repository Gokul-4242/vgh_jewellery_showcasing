import os
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
use_openai = bool(OPENAI_API_KEY)
if use_openai:
    import openai
    openai.api_key = OPENAI_API_KEY

# local generator (same approach as app.py)
_local_generator = None
def _init_local_generator():
    global _local_generator
    if _local_generator is not None:
        return
    try:
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
        model_name = os.getenv("LOCAL_MODEL", "google/flan-t5-small")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        _local_generator = {"tokenizer": tokenizer, "model": model}
    except Exception as e:
        _local_generator = e

def generate_local_text(prompt):
    _init_local_generator()
    if isinstance(_local_generator, Exception):
        raise _local_generator
    system = "You are a helpful assistant. Answer concisely and stay on topic."
    full = f"{system}\n{prompt}"
    tokenizer = _local_generator["tokenizer"]
    model = _local_generator["model"]
    inputs = tokenizer(full, return_tensors="pt")
    gen = model.generate(**inputs, max_new_tokens=150, do_sample=True, temperature=0.7, top_p=0.9)
    text = tokenizer.decode(gen[0], skip_special_tokens=True)
    # remove any leading system/instruction text if present
    if text.startswith(system):
        return text[len(system):].strip()
    return text.strip()

def chat_once(prompt):
    if use_openai:
        resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
        )
        return resp['choices'][0]['message']['content'].strip()
    else:
        return generate_local_text(prompt)


def main():
    print("CLI chat — type 'exit' to quit")
    while True:
        msg = input("You: ")
        if msg.strip().lower() in ('exit', 'quit'):
            break
        try:
            reply = chat_once(msg)
        except Exception as e:
            reply = f"Error: {e}"
        print("Bot:", reply)


if __name__ == '__main__':
    main()
