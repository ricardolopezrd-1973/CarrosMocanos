const AGENCIES_PATH = 'data/agencies.json';
const CMD_PATH = 'data/cmd.json';

function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const header = document.querySelector('header');

  if (!navToggle || !mobileMenu) return;

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.style.display = expanded ? 'none' : 'block';
    document.body.classList.toggle('nav-open', !expanded);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.style.display = 'none';
      document.body.classList.remove('nav-open');
    });
  });

  const handleSticky = () => {
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleSticky);
  handleSticky();
}

async function fetchJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${path}`);
  }
  return response.json();
}

function whatsappLink(number, message) {
  if (!number) return '#';
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

function buildAgencyCard(agency) {
  const container = document.createElement('article');
  container.className = 'card agency-card';
  const tags = [agency.size, agency.vehicle_types].filter(Boolean);
  const services = agency.services?.slice(0, 3).map((service) => `<li>${service}</li>`).join('') || '';

  container.innerHTML = `
    <div class="card-header">
      <img src="${agency.logo || 'assets/images/agency-placeholder.svg'}" alt="Logo de ${agency.name}" loading="lazy">
      ${agency.verified ? '<span class="badge">Verificada</span>' : ''}
    </div>
    <div class="card-body">
      <h3>${agency.name}</h3>
      <p>${agency.address}</p>
      <p class="tag"><span class="icon icon-phone" aria-hidden="true"></span><span>${agency.phone}</span></p>
      ${tags.length ? `<ul class="meta-list">${tags.map((t) => `<li>${t}</li>`).join('')}</ul>` : ''}
      ${services ? `<ul class="meta-list">${services}</ul>` : ''}
      ${agency.notes ? `<p class="subtle-text">${agency.notes}</p>` : ''}
      <div class="actions">
        <a class="btn btn-whatsapp" href="${whatsappLink(agency.whatsapp, 'Hola, vi su agencia en CarrosMocanos.com y quiero más información')}" target="_blank" rel="noopener">
          <span class="icon icon-whatsapp" aria-hidden="true"></span>
          WhatsApp
        </a>
        <a class="btn btn-outline" href="tel:${agency.phone}">
          <span class="icon icon-phone" aria-hidden="true"></span>
          Llamar
        </a>
      </div>
    </div>
  `;

  return container;
}

function buildVehicleCard(vehicle) {
  const container = document.createElement('article');
  container.className = 'card vehicle-card';
  const subtitle = vehicle.year ? `${vehicle.year}` : '';
  const price = vehicle.price ? `RD$ ${vehicle.price.toLocaleString('es-DO')}` : 'Precio a consultar';
  const number = vehicle.whatsapp || vehicle.whatsapp_number || '';
  const message = vehicle.whatsapp_message || `Hola, quiero más información sobre ${vehicle.title}`;

  container.innerHTML = `
    <div class="card-header">
      <img src="${vehicle.image || 'assets/images/car-placeholder.svg'}" alt="${vehicle.title}" loading="lazy">
      ${vehicle.price ? '' : '<span class="badge">Precio a consultar</span>'}
    </div>
    <div class="card-body">
      <h3>${vehicle.title}</h3>
      ${subtitle ? `<p>${subtitle}</p>` : ''}
      <p class="price">${price}</p>
      <div class="actions">
        <a class="btn btn-whatsapp" href="${whatsappLink(number, message)}" target="_blank" rel="noopener">
          <span class="icon icon-whatsapp" aria-hidden="true"></span>
          Quiero más información
        </a>
      </div>
    </div>
  `;

  return container;
}

async function renderHomeAgencies() {
  const container = document.getElementById('agencyCards');
  if (!container) return;

  try {
    const data = await fetchJSON(AGENCIES_PATH);
    data.agencies.slice(0, 9).forEach((agency) => {
      container.appendChild(buildAgencyCard(agency));
    });
  } catch (error) {
    container.innerHTML = `<p class="subtle-text">No se pudieron cargar las agencias.</p>`;
    console.error(error);
  }
}

async function renderAllAgencies() {
  const container = document.getElementById('agenciesPage');
  if (!container) return;

  try {
    const data = await fetchJSON(AGENCIES_PATH);
    data.agencies.forEach((agency) => {
      container.appendChild(buildAgencyCard(agency));
    });
  } catch (error) {
    container.innerHTML = `<p class="subtle-text">No se pudieron cargar las agencias.</p>`;
    console.error(error);
  }
}

async function renderHomeCmd() {
  const container = document.getElementById('cmdCards');
  if (!container) return;

  try {
    const data = await fetchJSON(CMD_PATH);
    data.cmd.slice(0, 6).forEach((vehicle) => {
      container.appendChild(buildVehicleCard(vehicle));
    });
  } catch (error) {
    container.innerHTML = `<p class="subtle-text">No se pudieron cargar los vehículos.</p>`;
    console.error(error);
  }
}

async function renderCmdPage() {
  const container = document.getElementById('cmdPage');
  if (!container) return;

  try {
    const data = await fetchJSON(CMD_PATH);
    data.cmd.forEach((vehicle) => {
      container.appendChild(buildVehicleCard(vehicle));
    });
  } catch (error) {
    container.innerHTML = `<p class="subtle-text">No se pudieron cargar los vehículos.</p>`;
    console.error(error);
  }
}

function init() {
  initNavigation();
  renderHomeAgencies();
  renderAllAgencies();
  renderHomeCmd();
  renderCmdPage();
}

document.addEventListener('DOMContentLoaded', init);
