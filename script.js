const backendUrl = `${process.env.BACKEND_URL}`
//const backendUrl = `${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}`;

function criarTabelaIngressos(compras) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Cabeçalho da tabela
  const headers = ['Filme', 'Data', 'Horário', 'Quantidade'];
  const headerRow = document.createElement('tr');
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Dados da tabela
  compras.forEach(compra => {
    const row = document.createElement('tr');
    const { movie, date, time, quantity } = compra;

    const movieCell = document.createElement('td');
    movieCell.textContent = movie;
    row.appendChild(movieCell);

    const dateCell = document.createElement('td');
    dateCell.textContent = date;
    row.appendChild(dateCell);

    const timeCell = document.createElement('td');
    timeCell.textContent = time;
    row.appendChild(timeCell);

    const quantityCell = document.createElement('td');
    quantityCell.textContent = quantity;
    row.appendChild(quantityCell);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  return table;
}

document.getElementById('purchaseForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');
  const quantityInput = document.getElementById('quantity');
  const confirmation = document.getElementById('confirmation');
  const formData = {
    movie: document.getElementById('movie').value,
    date: dateInput.value,
    time: timeInput.value,
    quantity: quantityInput.value
  };

  try {
    const response = await fetch(`http://${backendUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const movieSelect = document.getElementById('movie');
      const nomeFilme = movieSelect.options[movieSelect.selectedIndex].text;
      const quantidade = parseInt(formData.quantity);
      const formattedDate = new Date(formData.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');

      // Atualiza a mensagem de sucesso com os detalhes da última compra
      const mensagemSucesso = `Ingresso(s) comprado(s) com sucesso para o filme ${nomeFilme} no dia ${formattedDate} às ${formData.time}! Bom filme!<br>`;
      confirmation.innerHTML = `${mensagemSucesso}`;

      // Recupera todas as compras anteriores do local storage
      const comprasAnteriores = JSON.parse(localStorage.getItem('compras')) || [];
      // Adiciona a nova compra à lista de compras anteriores
      comprasAnteriores.push(formData);
      // Salva a lista de compras anteriores atualizada no local storage
      localStorage.setItem('compras', JSON.stringify(comprasAnteriores));

      // Cria a tabela de ingressos com todas as compras anteriores
      const tabelaIngressos = criarTabelaIngressos(comprasAnteriores);
      confirmation.appendChild(tabelaIngressos);
    } else {
      console.error('Erro ao comprar ingresso:', response.statusText);
      confirmation.innerText = 'Erro ao comprar ingresso. Por favor, tente novamente.';
    }
  } catch (error) {
    console.error('Erro ao comprar ingresso:', error);
    confirmation.innerText = 'Erro ao comprar ingresso. Por favor, tente novamente.';
  }
});
