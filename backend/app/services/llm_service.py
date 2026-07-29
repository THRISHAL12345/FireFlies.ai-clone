import os
import json
from typing import List, Dict, Any
from openai import OpenAI

# Initialize client using Groq's endpoint
# Since we might not have the API key in all environments (e.g. demo), 
# we create the client lazily or handle missing key gracefully.
def get_client() -> OpenAI | None:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    return OpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1",
    )

# Use a fast model for chat and summary
MODEL_NAME = "llama3-8b-8192"

def generate_summary(meeting_title: str, transcript_text: str) -> Dict[str, Any] | None:
    """
    Calls the LLM to generate a summary for the meeting.
    Returns a dictionary matching the schema for Summary.
    """
    client = get_client()
    if not client:
        return None # Graceful fallback to mock data if no API key is provided
        
    prompt = f"""
You are an expert meeting assistant. Analyze the following meeting transcript and generate a structured summary.
Meeting Title: {meeting_title}

Respond ONLY with valid JSON in the following exact structure, with no markdown codeblocks or extra text:
{{
    "overview_text": "A 2-3 sentence overview of what was discussed.",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    "action_items": [
        {{"text": "Action item description", "assignee": "Person Name or null if none"}}
    ],
    "outline": [
        {{"title": "Topic chapter title", "start_time_seconds": 0}}
    ]
}}

Transcript:
{transcript_text}
"""
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],  # type: ignore
            response_format={"type": "json_object"},
            temperature=0.3,
        )
        content = response.choices[0].message.content
        if content:
            return json.loads(content)
        return None
    except Exception as e:
        print(f"Error generating summary: {e}")
        return None

def generate_chat_response(transcript_text: str, chat_history: List[Dict[str, str]], query: str) -> str:
    """
    Calls the LLM to answer a user's question about the meeting.
    """
    client = get_client()
    if not client:
        return "I am AskFred (Mock Mode). To chat with me, please add a GROQ_API_KEY to your .env file!"
        
    system_prompt = f"""
You are AskFred, an AI assistant for a meeting transcription app called Fireflies.
You are helping the user understand a past meeting. 
Base your answers ONLY on the following meeting transcript. If the transcript doesn't contain the answer, say you don't know. Be concise and helpful.

Transcript:
{transcript_text}
"""

    messages: List[Any] = [{"role": "system", "content": system_prompt}]
    messages.extend(chat_history)
    messages.append({"role": "user", "content": query})
    
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,  # type: ignore
            temperature=0.5,
        )
        content = response.choices[0].message.content
        return content if content else "Sorry, I couldn't generate a response."
    except Exception as e:
        print(f"Error generating chat response: {e}")
        return "Sorry, I encountered an error while trying to generate a response."
