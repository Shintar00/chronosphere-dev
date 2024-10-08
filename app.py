from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
from duckduckgo_search import DDGS
import traceback
import logging
from duckduckgo_search.exceptions import RatelimitException

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"An error occurred: {str(e)}")
    logger.error(traceback.format_exc())
    return jsonify(error=str(e), stack_trace=traceback.format_exc()), 500

def translate_to_english(query):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Translate the following Japanese query to English, keeping the original meaning and context:"},
                {"role": "user", "content": query}
            ],
            temperature=0.3,
            max_tokens=100
        )
        return response.choices[0].message['content'].strip()
    except Exception as e:
        logger.error(f"Error translating query: {str(e)}")
        return query  # Return original query if translation fails

def perform_duckduckgo_search(query, max_results=1):
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, region='wt-wt', safesearch='off', timelimit='y', max_results=max_results))
            return [{'title': r['title'], 'URL': r['href'], 'content': r['body']} for r in results]
    except RatelimitException:
        logger.warning("Rate limit reached. Returning no results.")
        return None
    except Exception as e:
        logger.error(f"Error during search: {str(e)}")
        return None

@app.route('/api/search', methods=['POST'])
def get_search_results():
    try:
        data = request.get_json()
        query = data['query']
        
        logger.info(f"Received search query: {query}")
        
        english_query = translate_to_english(query)
        logger.info(f"Translated query: {english_query}")
        
        search_results = perform_duckduckgo_search(english_query, max_results=1)
        if search_results:
            return jsonify({"results": search_results})
        else:
            return jsonify({"results": [], "error": "最新情報が入手できませんでした。"})
    except Exception as e:
        logger.error(f"Error in get_search_results: {str(e)}")
        logger.error(traceback.format_exc())
        return handle_exception(e)

@app.route('/api/reason', methods=['POST'])
def reason():
    try:
        data = request.get_json()
        prompt = data['prompt']
        
        logger.info(f"Received reasoning request with prompt: {prompt[:100]}...")
        
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500
        )
        
        result = response.choices[0].message['content']
        
        logger.info("Reasoning completed successfully")
        
        return jsonify({"result": result})
    except Exception as e:
        logger.error(f"Error in reasoning: {str(e)}")
        logger.error(traceback.format_exc())
        return handle_exception(e)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=port, debug=True)