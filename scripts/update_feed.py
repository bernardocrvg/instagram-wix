import os
import json
import requests
from datetime import datetime

# Configurações
TOKEN = os.environ.get("IG_TOKEN")

if not TOKEN:
    print("AVISO: Token não encontrado.")
    exit(0)

def get_instagram_posts():
    print("--- Iniciando Modo Direto (Page/IG Token) ---")
    
    # Tenta descobrir o ID do Instagram Business associado a este token
    # Se o token for de Página, usamos o endpoint /me?fields=instagram_business_account
    # Se o token for de Instagram direto, o /me já pode ser o ID ou dar acesso
    
    try:
        # Tentativa 1: Token de Página -> Descobrir IG ID
        print("Verificando identidade do token...")
        me_url = f"https://graph.facebook.com/v18.0/me?fields=id,name,instagram_business_account&access_token={TOKEN}"
        me_resp = requests.get(me_url).json()
        
        ig_user_id = None
        
        if "instagram_business_account" in me_resp:
            ig_user_id = me_resp["instagram_business_account"]["id"]
            print(f"Token de Página detectado. ID Instagram vinculado: {ig_user_id}")
        elif "id" in me_resp:
            # Talvez seja um token direto de usuário ou a página não tem vínculo no campo padrão
            # Vamos tentar listar as contas conectadas se for um token de usuário que falhou antes
            # Mas como você disse que me/accounts tá vazio, vamos tentar assumir que o ID do /me É o ID da página
            page_id = me_resp["id"]
            print(f"ID identificado: {page_id}. Tentando buscar IG vinculado a este ID...")
            
            # Tenta buscar o IG ID explicitamente usando o ID da página
            page_ig_url = f"https://graph.facebook.com/v18.0/{page_id}?fields=instagram_business_account&access_token={TOKEN}"
            page_ig_resp = requests.get(page_ig_url).json()
            
            if "instagram_business_account" in page_ig_resp:
                ig_user_id = page_ig_resp["instagram_business_account"]["id"]
                print(f"Sucesso! ID Instagram encontrado: {ig_user_id}")
        
        if not ig_user_id:
            print("ERRO: Não foi possível encontrar um ID de Instagram Business vinculado a este token.")
            print("Resposta da API:", me_resp)
            return []

        # Passo 2: Pegar as mídias
        print(f"Buscando posts para o ID: {ig_user_id}...")
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
        print("Nenhum post foi salvo.")
