import os
import json
import requests
from datetime import datetime

# Configurações
TOKEN = os.environ.get("IG_TOKEN")
# Se não tiver token, usa dados falsos para não quebrar o build inicial
if not TOKEN:
    print("AVISO: Token não encontrado. O script não vai rodar corretamente.")
    exit(0)

def get_instagram_posts():
    url = f"https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token={TOKEN}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if "error" in data:
            print(f"Erro na API do Instagram: {data['error']['message']}")
            return []
            
        posts = []
        for item in data.get("data", []):
            # Só queremos Imagens ou Álbuns (Vídeos podem quebrar se não tiver thumbnail)
            media_url = item.get("media_url")
            if item.get("media_type") == "VIDEO":
                media_url = item.get("thumbnail_url", media_url)
                
            posts.append({
                "id": item["id"],
                "caption": item.get("caption", ""),
                "media_url": media_url,
                "permalink": item["permalink"],
                "timestamp": item["timestamp"],
                "username": item.get("username", "")
            })
            
        return posts
        
    except Exception as e:
        print(f"Erro ao conectar: {str(e)}")
        return []

def save_posts(posts):
    # Caminho para salvar dentro da pasta public do frontend
    output_path = os.path.join("frontend", "public", "posts.json")
    
    # Garante que a pasta existe
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print(f"Sucesso! {len(posts)} posts salvos em {output_path}")

if __name__ == "__main__":
    print("Iniciando atualização do feed...")
    posts = get_instagram_posts()
    if posts:
        save_posts(posts)
    else:
        print("Nenhum post encontrado ou erro na API.")
