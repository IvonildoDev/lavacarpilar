from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
# Configuração aprimorada do CORS
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

def inspect_db_schema():
    conn = sqlite3.connect('lavajato.db')
    c = conn.cursor()
    c.execute("PRAGMA table_info(clientes)")
    columns = c.fetchall()
    print("Esquema atual da tabela 'clientes':")
    for col in columns:
        print(f"  - {col[1]} ({col[2]})")
    conn.close()

def init_db():
    conn = sqlite3.connect('lavajato.db')
    c = conn.cursor()
    
    # Verificar se a tabela existe
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='clientes'")
    table_exists = c.fetchone()
    
    if not table_exists:
        # Criar a tabela com os nomes corretos
        c.execute('''CREATE TABLE clientes
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                      nome TEXT NOT NULL,
                      telefone TEXT NOT NULL,
                      tipoVeiculo TEXT NOT NULL,
                      placa TEXT NOT NULL,
                      marca TEXT NOT NULL,
                      modelo TEXT NOT NULL,
                      tipoLavagem TEXT NOT NULL,
                      valor TEXT NOT NULL,
                      formaPagamento TEXT NOT NULL,
                      data TEXT NOT NULL)''')
        print("Tabela 'clientes' criada com sucesso!")
    
    conn.commit()
    conn.close()
    print("Banco de dados inicializado com sucesso!")

# Rota para cadastrar cliente
@app.route('/api/clientes', methods=['POST'])
def cadastrar_cliente():
    try:
        data = request.get_json()
        
        # Extrair dados com os nomes usados no frontend
        nome = data['nome']
        telefone = data['telefone']
        tipoVeiculo = data['tipoVeiculo']  
        placa = data['placa']
        marca = data['marca']
        modelo = data['modelo']
        tipoLavagem = data['tipo']
        valor = data['valor']
        formaPagamento = data['formaPagamento']
        data_registro = data['data']
        
        conn = sqlite3.connect('lavajato.db')
        c = conn.cursor()
        
        # Usar os mesmos nomes de colunas que foram definidos na criação da tabela
        c.execute("""INSERT INTO clientes 
                    (nome, telefone, tipoVeiculo, placa, marca, modelo, 
                    tipoLavagem, valor, formaPagamento, data) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                  (nome, telefone, tipoVeiculo, placa, marca, modelo, 
                   tipoLavagem, valor, formaPagamento, data_registro))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Cliente cadastrado com sucesso!'}), 201
    except Exception as e:
        print(f"Erro ao cadastrar cliente: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Rota para listar clientes
@app.route('/api/clientes', methods=['GET'])
def listar_clientes():
    try:
        conn = sqlite3.connect('lavajato.db')
        c = conn.cursor()
        c.execute("SELECT * FROM clientes")
        
        clientes = []
        for row in c.fetchall():
            cliente = {
                'id': row[0],
                'nome': row[1],
                'telefone': row[2],
                'tipoVeiculo': row[3],
                'placa': row[4],
                'marca': row[5],
                'modelo': row[6],
                'tipo': row[7],  # Mapeando tipoLavagem para "tipo" no frontend
                'valor': row[8],
                'formaPagamento': row[9],
                'data': row[10]
            }
            clientes.append(cliente)
        
        conn.close()
        return jsonify(clientes)
    except Exception as e:
        print(f"Erro ao listar clientes: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Rota para filtrar por data
@app.route('/api/clientes/data', methods=['GET'])
def filtrar_por_data():
    try:
        data_inicio = request.args.get('inicio')
        data_fim = request.args.get('fim')
        
        conn = sqlite3.connect('lavajato.db')
        c = conn.cursor()
        c.execute("SELECT * FROM clientes WHERE data BETWEEN ? AND ?", 
                  (data_inicio, data_fim))
        
        clientes = []
        for row in c.fetchall():
            cliente = {
                'id': row[0],
                'nome': row[1],
                'telefone': row[2],
                'tipoVeiculo': row[3],
                'placa': row[4],
                'marca': row[5],
                'modelo': row[6],
                'tipo': row[7],  # Mapeando tipoLavagem para "tipo" no frontend
                'valor': row[8],
                'formaPagamento': row[9],
                'data': row[10]
            }
            clientes.append(cliente)
        
        conn.close()
        return jsonify(clientes)
    except Exception as e:
        print(f"Erro ao filtrar por data: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/admin/database', methods=['GET'])
def admin_database():
    try:
        conn = sqlite3.connect('lavajato.db')
        conn.row_factory = sqlite3.Row  # Para acessar colunas pelo nome
        c = conn.cursor()
        
        # Obter todos os registros
        c.execute("SELECT * FROM clientes ORDER BY id DESC")
        clientes = [dict(row) for row in c.fetchall()]
        
        # Estatísticas básicas
        c.execute("SELECT COUNT(*) as total FROM clientes")
        total = c.fetchone()['total']
        
        c.execute("SELECT COUNT(*) as carros FROM clientes WHERE tipoVeiculo='Carro'")
        carros = c.fetchone()['carros']
        
        c.execute("SELECT COUNT(*) as motos FROM clientes WHERE tipoVeiculo='Moto'")
        motos = c.fetchone()['motos']
        
        conn.close()
        
        # Retornar HTML formatado
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Administração do Banco de Dados - Lava Jato</title>
            <style>
                body {{ font-family: Arial, sans-serif; padding: 20px; }}
                h1 {{ color: #2c3e50; }}
                .stats {{ display: flex; gap: 20px; margin-bottom: 20px; }}
                .stat-card {{ background: #f8f9fa; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }}
                table {{ width: 100%; border-collapse: collapse; }}
                th, td {{ padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }}
                th {{ background-color: #2c3e50; color: white; }}
                tr:hover {{ background-color: #f5f5f5; }}
            </style>
        </head>
        <body>
            <h1>Administração do Banco de Dados - Lava Jato</h1>
            
            <div class="stats">
                <div class="stat-card">
                    <h3>Total de Registros</h3>
                    <p>{total}</p>
                </div>
                <div class="stat-card">
                    <h3>Carros</h3>
                    <p>{carros}</p>
                </div>
                <div class="stat-card">
                    <h3>Motos</h3>
                    <p>{motos}</p>
                </div>
            </div>
            
            <h2>Registros no Banco de Dados</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Tipo</th>
                    <th>Placa</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Lavagem</th>
                    <th>Valor</th>
                    <th>Pagamento</th>
                    <th>Data</th>
                </tr>
        """
        
        for cliente in clientes:
            html += f"""
                <tr>
                    <td>{cliente['id']}</td>
                    <td>{cliente['nome']}</td>
                    <td>{cliente['telefone']}</td>
                    <td>{cliente['tipoVeiculo']}</td>
                    <td>{cliente['placa']}</td>
                    <td>{cliente['marca']}</td>
                    <td>{cliente['modelo']}</td>
                    <td>{cliente['tipoLavagem']}</td>
                    <td>{cliente['valor']}</td>
                    <td>{cliente['formaPagamento']}</td>
                    <td>{cliente['data']}</td>
                </tr>
            """
        
        html += """
            </table>
        </body>
        </html>
        """
        
        return html
    except Exception as e:
        print(f"Erro na página de administração: {str(e)}")
        return f"<h1>Erro</h1><p>{str(e)}</p>"

@app.route('/ping', methods=['GET'])
def ping():
    try:
        # Testar a conexão com o banco de dados
        conn = sqlite3.connect('lavajato.db')
        conn.close()
        return jsonify({"status": "ok", "message": "API online, banco de dados conectado"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": f"Erro: {str(e)}"}), 500

if __name__ == '__main__':
    try:
        inspect_db_schema()
        init_db()
        print("Servidor iniciando em http://localhost:5000")
        app.run(debug=True, host='0.0.0.0')
    except Exception as e:
        print(f"Erro ao iniciar o servidor: {str(e)}")