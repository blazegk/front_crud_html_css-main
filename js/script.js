// Falso banco de dados de clientes, em memória RAM
var clientes = [];

// Falso banco de dados de academias, em memória RAM
var academias = [];

var estilos = [];

//guarda o cliente que está sendo alterado
var clienteAlterado = null;

// Função para abrir a modal
function openModal() {
    const modal = document.getElementById('modalstyle');
    modal.style.display = 'block'; // Exibe a modal
  }
  
  // Função para fechar a modal
  function closeModal() {
    const modal = document.getElementById('modalstyle');
    modal.style.display = 'none'; // Oculta a modal
  }

function mostrarModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "block";
}

function ocultarModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

function adicionar() {
  clienteAlterado = null; // marca que está adicionando um cliente
  limparFormulario();
  carregarAcademias();
  carregarListaEstilos();
  mostrarModal();
}

function buscar() {
    const criterio = document.getElementById("busca").value;
  
    if (!criterio) {
      alert("Digite algo para buscar.");
      return;
    }
  
    // Envia o critério de busca para o backend
    fetch(`http://localhost:3000/bodybuilder/search/${criterio}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nenhum cliente encontrado.");
        }
        return response.json();
      })
      .then((data) => {
        clientes = data; // Atualiza a lista de clientes com os resultados
        atualizarLista(); // Atualiza a tabela no frontend
      })
      .catch((error) => {
        alert(error.message);
      });
  }

function alterar(cpf) {
  //busca o cliente que será alterado
  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i];
    if (cliente.cpf == cpf) {
      document.getElementById("nome").value = cliente.nome;
      document.getElementById("cpf").value = cliente.cpf;
      document.getElementById("peso").value = cliente.peso;
      document.getElementById("altura").value = cliente.altura;
      document.getElementById("dataNascimento").value = cliente.dataNascimento;
      document.getElementById("sapato").value = cliente.sapato;
      document.getElementById("dataBeijo").value = cliente.dataBeijo;
      document.getElementById("piriquito").value = cliente.piriquito;
      document.getElementById("academia").value = cliente.gym.id;
      clienteAlterado = cliente; //guarda o cliente que está sendo alterado
      mostrarModal();
    }
  }
}

function excluir(cpf) {
  if (confirm("Deseja realmente excluir este body builder?")) {
    fetch("http://localhost:3000/body-builder/" + cpf, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then(() => {
        alert("Excluído com sucesso");
        carregarClientes();
      })
      .catch((error) => {
        alert("Erro ao cadastrar");
      });
  }
}

function salvar() {
  let nome = document.getElementById("nome").value;
  let cpf = document.getElementById("cpf").value;
  let peso = document.getElementById("peso").value;
  let altura = document.getElementById("altura").value;
  let dataNascimento = document.getElementById("dataNascimento").value;
  let sapato = document.getElementById("sapato").value;
  let dataBeijo = document.getElementById("dataBeijo").value;
  let piriquito = document.getElementById("piriquito").value;
  let idacademia = document.getElementById("academia").value;
  let idestilo = document.getElementById("estilo-bodybuilder").value;

  console.log(idestilo);

  let novoBodyBuilder = {
    nome: nome,
    cpf: cpf,
    peso: peso,
    altura: altura,
    dataNascimento: dataNascimento,
    sapato: sapato,
    dataBeijo: dataBeijo,
    piriquito: piriquito,
    idacademia: idacademia,
    idestilo: idestilo
  };

  //se clienteAlterado == null, então está adicionando um novo cliente
  if (clienteAlterado == null) {
    fetch("http://localhost:3000/body-builder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(novoBodyBuilder),
    })
      .then(() => {
        alert("Cadastrado com sucesso");
      })
      .catch((error) => {
        alert("Erro ao cadastrar");
      });
  } else {
    //senao está alterando um cliente
    fetch("http://localhost:3000/body-builder/" + clienteAlterado.cpf, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(novoBodyBuilder),
    })
      .then(() => {
        alert("Alterado com sucesso");
      })
      .catch((error) => {
        alert("Erro ao alterar");
      });
  }

  ocultarModal();

  limparFormulario();

  carregarClientes();
  return false;
}

function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("cpf").value = "";
  document.getElementById("peso").value = "";
  document.getElementById("altura").value = "";
  document.getElementById("dataNascimento").value = "";
  document.getElementById("sapato").value = "";
  document.getElementById("dataBeijo").value = "";
  document.getElementById("piriquito").value = "";
}

function atualizarLista() {
  let tbody = document.getElementsByTagName("tbody")[0]; //pega o primeiro tbody da página
  tbody.innerHTML = ""; //limpa as linhas da tabela
  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i];

    let linhaTabela = document.createElement("tr");
    linhaTabela.innerHTML = `   
            <td>${cliente.cpf}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.peso}kg</td>
            <td>${cliente.altura}m</td>
            <td>${cliente.dataNascimento}</td>
            <td>${cliente.sapato}</td>
            <td>${cliente.dataBeijo}</td>
            <td>${cliente.piriquito}</td>
            <td>${cliente.gym.nome}</td>
            <td>${cliente.style.nome}</td>
                <td>
                <button onclick="alterar('${cliente.cpf}')">Alterar</button>
                <button onclick="excluir('${cliente.cpf}')">Excluir</button>
                </td>`;

    tbody.appendChild(linhaTabela);
  }
}

function carregarClientes() {
  fetch("http://localhost:3000/body-builder", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao listar clientes");
      }
      return response.json();
    })
    .then((data) => {
      clientes = data; // Atualiza a lista de clientes com os dados recebidos
      atualizarLista(); // Atualiza a tabela no frontend
    })
    .catch((error) => {
      alert("Erro ao listar clientes: " + error.message);
    });
}

function carregarAcademias() {
  fetch("http://localhost:3000/gym", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      academias = data; //recebe a lista de academias do back
      atualizarListaAcademias();
    })
    .catch((error) => {
      console.log(error);
      alert("Erro ao listar clientes");
    });
}

function atualizarListaAcademias() {
  const listaAcademia = document.getElementById("academia");
  listaAcademia.innerHTML = "";
  for (let i = 0; i < academias.length; i++) {
    let academia = academias[i];
    let option = document.createElement("option");
    option.value = academia.id;
    option.innerHTML = academia.nome;
    listaAcademia.appendChild(option);
  }
}

function salvarEstilo() {
    let nome = document.getElementById("estilo").value; // Obtém o nome do input
  
    // Cria o objeto estilo
    let style = {
      nome: nome
    };
  
    // Envia a requisição para o servidor
    fetch("http://localhost:3000/style", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Define que o corpo da requisição é JSON
      },
      mode: "cors", // Permite requisições CORS
      body: JSON.stringify(style), // Envia o estilo como string JSON
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao cadastrar: ' + response.statusText); // Tratar erros de resposta
        }
        return response.text();
      })
      .then(data => {
        alert("Cadastrado com sucesso"); // Sucesso
      })
      .catch((error) => {
        alert("Erro ao cadastrar: " + error.message); // Erro ao tentar enviar
      });
      closeModal();
    return false;
    
  }

  function atualizarListaEstilos() {
    const listaEstilos = document.getElementById("estilo-bodybuilder");
    listaEstilos.innerHTML = "";
    for (let i = 0; i < estilos.length; i++) {
      let estilo = estilos[i];
      let option = document.createElement("option");
      option.value = estilo.id;
      option.innerHTML = estilo.nome;
      listaEstilos.appendChild(option);
    }
  }

  function carregarListaEstilos() {
    fetch("http://localhost:3000/style", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        estilos = data; //recebe a lista de academias do back
        atualizarListaEstilos();
      })
      .catch((error) => {
        console.log(error);
        alert("Erro ao carregar lista de estilos: " + error);
      });
  }
  
  
