import os
import json
import requests
from datetime import datetime

# Configurações
TOKEN = os.environ.get("IG_TOKEN")

if not TOKEN:
    print("AVISO: Token não encontrado. O script não vai rodar corretamente.")
    exit(0)

def get_instagram_posts():
    # Tenta primeiro a Graph API (Business/Creator)
    # Endpoint: https://graph.facebook.com/v18.0/me/media?fields=...
    # Nota: Para Graph API, 'me' refere-se à Página do Facebook vinculada, então precisamos descobrir o ID do Instagram primeiro.
    
    try:
        # Passo 1: Descobrir o ID da conta do Instagram Business vinculada ao usuário
        user_url = f"https://graph.facebook.com/v18.0/me/accounts?access_token={TOKEN}"
        user_resp = requests.get(user_url).json()
        
        ig_user_id = None
        
        # Procura nas páginas vinculadas alguma que tenha instagram_business_account
        if "data" in user_resp:
            for page in user_resp["data"]:
                if "instagram_business_account" in page:
                    ig_user_id = page["instagram_business_account"]["id"]
                    break
        
        # Se não achou via /me/accounts, tenta o endpoint direto de User (caso o token seja de Basic Display)
        if not ig_user_id:
            print("Tentando modo Basic Display (Fallback)...")
            return get_basic_display_posts()

        print(f"ID da conta Instagram encontrado: {ig_user_id}")

        # Passo 2: Pegar as mídias usando o ID encontrado
        media_url = f"https://graph.facebook.com/v18.0/{ig_user_id}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token={TOKEN}&limit=20"
        
        response = requests.get(media_url)
        data = response.json()
        
        if "error" in data:
            print(f"Erro na Graph API: {data['error']['message']}")
            return []
            
        return process_posts(data.get("data", []))

    except Exception as e:
        print(f"Erro ao conectar na Graph API: {str(e)}")
        print("Tentando fallback para Basic Display...")
        return get_basic_display_posts()

def get_basic_display_posts():
    # Endpoint antigo (Basic Display)
    url = f"https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token={TOKEN}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if "error" in data:
            print(f"Erro na Basic Display API: {data['error']['message']}")
            return []
            
        return process_posts(data.get("data", []))
        
    except Exception as e:
        print(f"Erro fatal: {str(e)}")
        return []

def process_posts(raw_data):
    posts = []
    for item in raw_data:
        # Só queremos Imagens ou Álbuns
        media_url = item.get("media_url")
        if item.get("media_type") == "VIDEO":
            media_url = item.get("thumbnail_url", media_url)
            
        # Se não tiver imagem nem thumbnail (vídeo sem capa), pula
        if not media_url:
            continue

        posts.append({
            "id": item["id"],
            "caption": item.get("caption", ""),
            "media_url": media_url,
            "permalink": item["permalink"],
            "timestamp": item["timestamp"],
            "username": item.get("username", "")
        })
    return posts

def save_posts(posts):
    output_path = os.path.join("frontend", "public", "posts.json")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print(f"Sucesso! {len(posts)} posts salvos em {output_path}")

if __name__ == "__main__":
    print("Iniciando atualização do feed (Modo Híbrido)...")
    posts = get_instagram_posts()
    if posts:
        save_posts(posts)
    else:
        print("Nenhum post encontrado.")
