import os
import json
import requests
from datetime import datetime

# Configurações
TOKEN = os.environ.get("IG_TOKEN")

if not TOKEN:
    print("AVISO: Token não encontrado. O script não vai rodar corretamente.")
    exit(0)

def debug_token():
    # Verifica se o token é válido e quais permissões tem
    url = f"https://graph.facebook.com/v18.0/me?fields=id,name,permissions&access_token={TOKEN}"
    resp = requests.get(url).json()
    if "error" in resp:
        print(f"DEBUG: Token inválido ou erro de conexão: {resp['error']['message']}")
        return False
    print(f"DEBUG: Token válido para usuário: {resp.get('name')} (ID: {resp.get('id')})")
    return True

def get_instagram_posts():
    print("--- Iniciando Diagnóstico Graph API ---")
    
    if not debug_token():
        print("ERRO FATAL: O token fornecido não funciona. Verifique se copiou corretamente.")
        return []

    try:
        # Passo 1: Listar páginas e ver vínculos
        print("Buscando páginas vinculadas...")
        user_url = f"https://graph.facebook.com/v18.0/me/accounts?fields=id,name,instagram_business_account&access_token={TOKEN}"
        user_resp = requests.get(user_url).json()
        
        if "error" in user_resp:
            print(f"ERRO ao buscar páginas: {user_resp['error']['message']}")
            return []
            
        ig_user_id = None
        
        if "data" in user_resp:
            print(f"Encontradas {len(user_resp['data'])} páginas.")
            for page in user_resp["data"]:
                print(f"- Página: {page.get('name')} (ID: {page.get('id')})")
                if "instagram_business_account" in page:
                    ig_user_id = page["instagram_business_account"]["id"]
                    print(f"  -> VINCULADA ao Instagram ID: {ig_user_id}")
                    break
                else:
                    print("  -> SEM vínculo com Instagram Business.")
        
        if not ig_user_id:
            print("ERRO: Nenhuma conta de Instagram Business encontrada nas páginas desse usuário.")
            print("DICA: Verifique se sua conta do Instagram é 'Comercial' ou 'Criador' e se está vinculada a uma Página do Facebook.")
            return []

        print(f"--- Buscando Mídias para ID: {ig_user_id} ---")

        # Passo 2: Pegar as mídias
        media_url = f"https://graph.facebook.com/v18.0/{ig_user_id}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token={TOKEN}&limit=20"
        
        response = requests.get(media_url)
        data = response.json()
        
        if "error" in data:
            print(f"ERRO ao buscar mídia: {data['error']['message']}")
            return []
            
        posts = process_posts(data.get("data", []))
        print(f"Sucesso! {len(posts)} posts encontrados.")
        return posts

    except Exception as e:
        print(f"ERRO DE EXCEÇÃO: {str(e)}")
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
        print("Nenhum post foi salvo devido aos erros acima.")
