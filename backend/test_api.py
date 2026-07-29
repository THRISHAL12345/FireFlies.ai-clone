from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api():
    print("Testing /api/meetings")
    r = client.get("/api/meetings")
    assert r.status_code == 200, r.text
    meetings = r.json()
    print(f"Got {len(meetings)} meetings")
    
    if len(meetings) > 0:
        m_id = meetings[0]["id"]
        
        print(f"Testing /api/meetings/{m_id}")
        r = client.get(f"/api/meetings/{m_id}")
        assert r.status_code == 200, r.text
        
        print(f"Testing /api/meetings/{m_id}/transcript")
        r = client.get(f"/api/meetings/{m_id}/transcript")
        assert r.status_code == 200, r.text
        print(f"Got {len(r.json())} transcript segments")
        
        print(f"Testing /api/meetings/{m_id}/transcript/search?q=a")
        r = client.get(f"/api/meetings/{m_id}/transcript/search?q=a")
        assert r.status_code == 200, r.text
        
        print(f"Testing /api/meetings/{m_id}/summary")
        r = client.get(f"/api/meetings/{m_id}/summary")
        assert r.status_code == 200, r.text
        
        print(f"Testing /api/meetings/{m_id}/action-items")
        r = client.get(f"/api/meetings/{m_id}/action-items")
        assert r.status_code == 200, r.text
        print(f"Got {len(r.json())} action items")
        
    print("All tests passed!")

if __name__ == "__main__":
    test_api()
