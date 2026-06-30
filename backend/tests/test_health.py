

def test_health_endpoint_responds(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "mongodb" in data
    assert "vectorstore" in data
