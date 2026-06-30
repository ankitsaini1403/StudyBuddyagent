"""
Shared constants used across the application.
"""

# --- Collections / table names ---
USERS_COLLECTION = "users"
NOTES_COLLECTION = "notes"
QUIZZES_COLLECTION = "quizzes"
CHAT_SESSIONS_COLLECTION = "chat_sessions"

# --- File handling ---
ALLOWED_UPLOAD_EXTENSIONS = {".pdf", ".txt", ".md", ".docx"}

# --- Agent ---
DEFAULT_AGENT_TEMPERATURE = 0.3
MAX_AGENT_ITERATIONS = 6
DEFAULT_RAG_TOP_K = 4

# --- Quiz ---
QUIZ_DIFFICULTIES = ("easy", "medium", "hard")
DEFAULT_QUIZ_QUESTION_COUNT = 5

# --- Misc ---
DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S"
