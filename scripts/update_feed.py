import os
import json
import requests
from datetime import datetime

# Configurações
TOKEN = os.environ.get("IG_TOKEN")
ACCOUNT_ID = os.environ.get("IG_ACCOUNT_ID") # Novo segredo opcional

if not TOKEN:
    print("AVISO: Token não encontrado.")
    exit(0)

def get_instagram_posts():
    print("--- Iniciando Modo Direto (ID Específico) ---")
    
    ig_user_id = ACCOUNT_ID
    
    # Se não tiver ID no segredo, tenta descobrir (fallback)
    if not ig_user_id:
        print("AVISO: IG_ACCOUNT_ID não configurado. Tentando descoberta automática...")
        # ... (código de descoberta anterior omitido para simplificar, focando no ID direto)
        # Se chegou aqui sem ID, vamos tentar um último chute no /me
        try:
            me_resp = requests.get(f"https://graph.facebook.com/v18.0/me?fields=instagram_business_account&access_token={TOKEN}").json()
            if "instagram_business_account" in me_resp:
                ig_user_id = me_resp["instagram_business_account"]["id"]
        except:
            pass

    if not ig_user_id:
        print("ERRO FATAL: Não foi possível obter o ID da conta. Configure o segredo IG_ACCOUNT_ID.")
        return []

    print(f"Usando ID de Conta: {ig_user_id}")

    # Passo 2: Pegar as mídias usando o ID direto
    # Adicionei 'limit=100' para garantir que pegamos posts suficientes
    media_url = f"https://graph.facebook.com/v18.0/{ig_user_id}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token={TOKEN}&limit=20"
    
    try:
        response = requests.get(media_url)
        data = response.json()
        
        if "error" in data:
            print(f"ERRO ao buscar mídia: {data['error']['message']}")
            # Se der erro de token aqui, é porque o token realmente não serve para esse ID
            return []
            
        posts = process_posts(data.get("data", []))
        print(f"Sucesso! {len(posts)} posts encontrados.")
        return posts
    except Exception as e:
        print(f"Erro de conexão: {str(e)}")
        return []

def process_posts(raw_data):
    posts = []
    for item in raw_data:
        media_url = item.get("media_url")
        if item.get("media_type") == "VIDEO":
            media_url = item.get("thumbnail_url", media_url)
            
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
    print(f"Arquivo salvo em: {output_path}")

if __name__ == "__main__":
    posts = get_instagram_posts()
    if posts:
        save_posts(posts)
    else:
        print("Nenhum post foi salvo.")
