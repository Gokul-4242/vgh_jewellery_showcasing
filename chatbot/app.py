from flask import Flask, render_template, request, jsonify, make_response
import os
from dotenv import load_dotenv

ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
use_openai = bool(OPENAI_API_KEY)
if use_openai:
    import openai
    openai.api_key = OPENAI_API_KEY

app = Flask(__name__, static_folder='static', template_folder='templates')


def set_cors_headers(response):
    origin = request.headers.get('Origin')
    if origin in ALLOWED_ORIGINS:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response


@app.after_request
def add_cors_headers(response):
    return set_cors_headers(response)

# Local model lazy init
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
        app.logger.exception('Local generator init failed')

def generate_local_text(prompt):
    _init_local_generator()
    if isinstance(_local_generator, Exception):
        raise _local_generator
    # use seq2seq generation (tokenizer+model) for encoder-decoder models like FLAN-T5
    system = "You are a helpful assistant. Answer concisely and stay on topic."
    full = f"{system}\n{prompt}"
    tokenizer = _local_generator["tokenizer"]
    model = _local_generator["model"]
    inputs = tokenizer(full, return_tensors="pt")
    # run generation on CPU
    gen = model.generate(**inputs, max_new_tokens=150, do_sample=True, temperature=0.7, top_p=0.9)
    text = tokenizer.decode(gen[0], skip_special_tokens=True)
    # strip the full prompt prefix if present
    if text.startswith(full):
        return text[len(full):].strip()
    # fallback: if model returned only continuation, try to remove the user prompt
    if text.startswith(system):
        # remove system and any echoed user
        stripped = text[len(system):].strip()
        if stripped.startswith("User:"):
            # remove up to 'Assistant:'
            idx = stripped.find("Assistant:")
            if idx != -1:
                return stripped[idx + len("Assistant:"):].strip()
    return text.strip()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        response = make_response('', 200)
        return set_cors_headers(response)

    data = request.get_json() or {}
    message = data.get('message', '')
    if not message:
        response = jsonify({'error': 'no message'})
        return set_cors_headers(response), 400
    try:
        if use_openai:
            resp = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": message}],
                max_tokens=500,
                temperature=0.7,
            )
            text = resp['choices'][0]['message']['content'].strip()
        else:
            # fallback to a small local model (distilgpt2)
            text = generate_local_text(message)
        response = jsonify({'reply': text})
        return set_cors_headers(response)
    except Exception as e:
        response = jsonify({'error': str(e)})
        return set_cors_headers(response), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)