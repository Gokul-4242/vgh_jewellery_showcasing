# LLM Chatbot

Simple chatbot using OpenAI's Chat API with a minimal Flask web UI and a CLI.

Getting started

1. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate  # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

2. Set your API key (see `.env.example`):

```bash
cp .env.example .env
# Edit .env and set OPENAI_API_KEY
```

3. Run the web app:

```bash
python app.py
# open http://localhost:5000
```

4. Or use the CLI chat:

```bash
python cli_chat.py
```

Files

- [app.py](app.py): Flask web app exposing `/api/chat`.
- [cli_chat.py](cli_chat.py): simple CLI chat loop.an OpenAI key (downloads a small HF model).

Updating README to document free local model fallback and note potential downloads.

Reading README.md to patch it correctly.

Read README.md

Updating notes section

I’m focusing on replacing the lines in the Notes section. I need to draft a patch update that will replace the last two lines there. Specifically, I’ll find the lines starting with "- This project uses..." and "- To switch..." and create new paragraphs to update those. It seems like getting the context right for the patch will be important too. I’m on it! Let’s make sure everything is clear in the update.

Edite
- [templates/index.html](templates/index.html): web UI.
- [static/chat.js](static/chat.js): frontend logic.
- [.env.example](.env.example): example environment file.
- [requirements.txt](requirements.txt): Python deps.

Notes

- This project uses the OpenAI API if `OPENAI_API_KEY` is set. If no key is provided, the app will automatically fall back to a small free local model (`distilgpt2`) via the `transformers` library.

Notes about the free local model fallback

- If you don't have `OPENAI_API_KEY`, the app and CLI will use `distilgpt2` (free) to generate replies. The first run will download model weights from Hugging Face — this may take time and bandwidth.
- Local model generation runs on CPU by default and is slower and less capable than hosted LLMs like OpenAI's completions.
- To force use of OpenAI, set `OPENAI_API_KEY` in your environment or `.env` file.
