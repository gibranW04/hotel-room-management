const roomTableBody = document.querySelector('#room-table-body');
const addRoomButton = document.querySelector('#add-room-button');
const formOverlay = document.querySelector('#form-overlay');
const roomForm = document.querySelector('#room-form');
const formTitle = document.querySelector('#form-title');
const saveButton = document.querySelector('#save-room-button');
const cancelButton = document.querySelector('#cancel-button');

let rooms = [
  {
    id: 1,
    number: '301',
    image: 'images/standard-room.jpg',
    type: 'Standard',
    price: 'Rp500.000',
    floor: '3',
    status: 'Available'
  },
  {
    id: 2,
    number: '405',
    image: 'images/deluxe-room.jpg',
    type: 'Deluxe',
    price: 'Rp850.000',
    floor: '4',
    status: 'Occupied'
  },
  {
    id: 3,
    number: '607',
    image: 'images/suite-room.jpg',
    type: 'Suite',
    price: 'Rp1.500.000',
    floor: '6',
    status: 'Maintenance'
  }
];

let editingId = null;

const statusClass = {
  Available: 'available',
  Occupied: 'occupied',
  Maintenance: 'maintenance'
};

const detailPages = {
  Standard: 'detail-standard.html',
  Deluxe: 'detail-deluxe.html',
  Suite: 'detail-suite.html'
};

const defaultImages = {
  Standard: 'images/standard-room.jpg',
  Deluxe: 'images/deluxe-room.jpg',
  Suite: 'images/suite-room.jpg'
};

function renderRooms() {
  roomTableBody.innerHTML = rooms.map(room => {
    const detailLink = detailPages[room.type] || '#';
    return `
      <tr>
        <td>${room.number}</td>
        <td><img src="${room.image}" alt="${room.type} Room" class="room-thumb"></td>
        <td>${room.type}</td>
        <td>${room.price}</td>
        <td>${room.floor}</td>
        <td><span class="status ${statusClass[room.status] || ''}">${room.status}</span></td>
        <td class="table-actions">
          <button class="btn-action btn-edit" data-id="${room.id}">Edit</button>
          <button class="btn-action btn-delete" data-id="${room.id}">Delete</button>
          <a href="${detailLink}" class="btn-detail">View</a>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', () => openForm('edit', Number(button.dataset.id)));
  });

  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', () => deleteRoom(Number(button.dataset.id)));
  });
}

function openForm(mode, id = null) {
  formOverlay.classList.add('open');
  if (mode === 'edit') {
    formTitle.textContent = 'Edit Kamar';
    editingId = id;
    const room = rooms.find(item => item.id === id);
    if (room) {
      roomForm.number.value = room.number;
      roomForm.image.value = room.image;
      roomForm.type.value = room.type;
      roomForm.price.value = room.price;
      roomForm.floor.value = room.floor;
      roomForm.status.value = room.status;
    }
    saveButton.textContent = 'Simpan Perubahan';
  } else {
    formTitle.textContent = 'Tambah Kamar Baru';
    editingId = null;
    roomForm.reset();
    saveButton.textContent = 'Simpan Kamar';
  }
}

function closeForm() {
  formOverlay.classList.remove('open');
}

function deleteRoom(id) {
  const room = rooms.find(item => item.id === id);
  if (!room) return;
  const confirmed = window.confirm(`Hapus kamar ${room.number} (${room.type})?`);
  if (confirmed) {
    rooms = rooms.filter(item => item.id !== id);
    renderRooms();
  }
}

roomForm.addEventListener('submit', event => {
  event.preventDefault();
  const roomType = roomForm.type.value;
  const imageValue = roomForm.image.value.trim();

  const newRoom = {
    id: editingId || Date.now(),
    number: roomForm.number.value.trim(),
    image: imageValue || defaultImages[roomType] || 'images/standard-room.jpg',
    type: roomType,
    price: roomForm.price.value.trim(),
    floor: roomForm.floor.value.trim(),
    status: roomForm.status.value
  };

  if (editingId) {
    rooms = rooms.map(room => room.id === editingId ? newRoom : room);
  } else {
    rooms = [...rooms, newRoom];
  }

  closeForm();
  renderRooms();
});

addRoomButton.addEventListener('click', () => openForm('create'));
cancelButton.addEventListener('click', closeForm);
formOverlay.addEventListener('click', event => {
  if (event.target === formOverlay) {
    closeForm();
  }
});

window.addEventListener('DOMContentLoaded', renderRooms);
