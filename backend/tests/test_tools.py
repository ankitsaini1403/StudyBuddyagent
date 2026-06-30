
import pytest

from app.tools.calculator import safe_eval
from app.tools.word_count import word_count


def test_safe_eval_basic_arithmetic():
    assert safe_eval("2 + 2") == 4
    assert safe_eval("10 * 4 - 5") == 35
    assert safe_eval("2 ** 5") == 32


def test_safe_eval_rejects_unsupported_nodes():
    with pytest.raises(Exception):
        safe_eval("__import__('os').system('echo hi')")


def test_word_count_tool():
    result = word_count.invoke({"text": "Hello world. This is a test!"})
    assert "Words: 6" in result
    assert "Sentences: 2" in result
