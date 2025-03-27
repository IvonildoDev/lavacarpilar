from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Criar banco de dados e tabela com todos os campos
def init_db():
    conn = sqlite3.connect('lavajato.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS clientes
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
    conn.commit()
    conn.close()

# Rota para cadastrar cliente
@app.route('/api/clientes', methods=['POST'])
def cadastrar_cliente():
    data = request.get_json()
    
    # Extrair todos os campos
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
    c.execute("""INSERT INTO clientes 
                (nome, telefone, tipoVeiculo, placa, marca, modelo, 
                tipoLavagem, valor, formaPagamento, data) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
              (nome, telefone, tipoVeiculo, placa, marca, modelo, 
               tipoLavagem, valor, formaPagamento, data_registro))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Cliente cadastrado com sucesso!'}), 201

# Rota para listar clientes
@app.route('/api/clientes', methods=['GET'])
def listar_clientes():
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
            'tipo': row[7],
            'valor': row[8],
            'formaPagamento': row[9],
            'data': row[10]
        }
        clientes.append(cliente)
    
    conn.close()
    return jsonify(clientes)

# Rota para filtrar por data
@app.route('/api/clientes/data', methods=['GET'])
def filtrar_por_data():
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
            'tipo': row[7],
            'valor': row[8],
            'formaPagamento': row[9],
            'data': row[10]
        }
        clientes.append(cliente)
    
    conn.close()
    return jsonify(clientes)

if __name__ == '__main__':
    init_db()
    app.run(debug=True)