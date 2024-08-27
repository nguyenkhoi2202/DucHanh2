let records = JSON.parse(localStorage.getItem('dentalRecords')) || [];
let editIndex = -1;

function addRow() {
    const table = document.getElementById('treatmentTableBody');
    const newRow = table.insertRow();

    const cols = ['date', 'tooth', 'treatment', 'cost', 'paid', 'remaining', 'doctor', 'appointment'];
    cols.forEach(col => {
        const cell = newRow.insertCell();
        const input = document.createElement('input');
        input.type = (col === 'date' || col === 'appointment') ? 'date' : (col === 'cost' || col === 'paid' || col === 'remaining') ? 'number' : 'text';
        input.name = col;
        cell.appendChild(input);
    });
}

document.getElementById('dentalForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    let jsonData = {
        id: editIndex > -1 ? records[editIndex].id : new Date().getTime(),
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        dob: formData.get('dob'),
        visitDate: formData.get('visitDate'),
        appointment: formData.get('appointment'),
        plan: []
    };

    const rows = document.querySelectorAll('#treatmentTableBody tr');
    rows.forEach(row => {
        let planItem = {};
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            planItem[input.name] = input.value;
        });
    
        jsonData.plan.push(planItem);
    });

    if (editIndex > -1) {
        records[editIndex] = jsonData;
        editIndex = -1;
    } else {
        records.push(jsonData);
    }


    localStorage.setItem('dentalRecords', JSON.stringify(records));
    displayRecords();
    this.reset();
});

function displayRecords() {
    const tableBody = document.getElementById('recordTableBody');
    tableBody.innerHTML = '';
    records.forEach((record, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = record.name;
        row.insertCell(2).textContent = record.phone;
        row.insertCell(3).textContent = record.address;
        row.insertCell(4).textContent = record.dob;
        row.insertCell(5).textContent = record.visitDate;
        row.insertCell(6).textContent = record.appointment;
        const actionCell = row.insertCell(7);
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Sửa';
        editButton.onclick = () => editRecord(index);
        actionCell.appendChild(editButton);
    });
}

function editRecord(index) {
    editIndex = index;
    const record = records[index];

    document.getElementById('name').value = record.name;
    document.getElementById('phone').value = record.phone;
    document.getElementById('address').value = record.address;
    document.getElementById('dob').value = record.dob;
    document.getElementById('visitDate').value = record.visitDate;
    document.getElementById('appointment').value = record.appointment;

    const tableBody = document.getElementById('treatmentTableBody');
    tableBody.innerHTML = '';
    record.plan.forEach(planItem => {
        const newRow = tableBody.insertRow();
        const cols = ['date', 'tooth', 'treatment', 'cost', 'paid', 'remaining', 'doctor'];
        cols.forEach(col => {
            const cell = newRow.insertCell();
            const input = document.createElement('input');
            input.type = (col === 'date' || col === 'appointment') ? 'date' : (col === 'cost' || col === 'paid' || col === 'remaining') ? 'number' : 'text';
            input.name = col;
            input.value = planItem[col];
            cell.appendChild(input);
        });
    });

    document.getElementById('deleteButton').classList.remove('hidden');
}

function deleteRecord() {
    if (editIndex > -1) {
        records.splice(editIndex, 1);
        localStorage.setItem('dentalRecords', JSON.stringify(records));
        displayRecords();
        document.getElementById('dentalForm').reset();
        document.getElementById('deleteButton').classList.add('hidden');
        editIndex = -1;
    }
}

function addNew(){
    document.getElementById("searchPhone").value = "";
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    // document.getElementById("myInputField").value = "";
    // document.getElementById("myInputField").value = "";
    // document.getElementById("myInputField").value = "";

    var inputs = document.querySelectorAll("#treatmentTableBody input, #treatmentTableBody textarea");
    
    // Lặp qua từng input và textarea để xóa dữ liệu
    inputs.forEach(function(input) {
        if (input.type !== "submit" && input.type !== "button" && !input.hasAttribute('readonly')) {
            input.value = "";
        }
    });
}

function searchLichHen(){
    const lichhen = document.getElementById('lichhen').value;
    let filteredRecords = records.filter(record => record.appointment.toLowerCase().includes(lichhen));


    const tableBody = document.getElementById('recordTableBody');
    tableBody.innerHTML = '';
    filteredRecords.forEach((record, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = record.name;
        row.insertCell(2).textContent = record.phone;
        row.insertCell(3).textContent = record.address;
        row.insertCell(4).textContent = record.dob;
        row.insertCell(5).textContent = record.visitDate;
        row.insertCell(6).textContent = record.appointment;
        const actionCell = row.insertCell(7);
        const editButton = document.createElement('button');
        editButton.textContent = 'Sửa';
        editButton.onclick = () => editRecord(records.indexOf(record));
        actionCell.appendChild(editButton);
    });

}

function searchRecords() {
    const searchPhone = document.getElementById('searchPhone').value.toLowerCase();
    let filteredRecords = records.filter(record => record.phone.toLowerCase().includes(searchPhone));
    
    // Nếu không tìm thấy theo số điện thoại, tìm theo tên
    if (filteredRecords.length === 0) {
        filteredRecords = records.filter(record => record.name.toLowerCase().includes(searchPhone));
    }
    
    const tableBody = document.getElementById('recordTableBody');
    tableBody.innerHTML = '';
    filteredRecords.forEach((record, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = record.name;
        row.insertCell(2).textContent = record.phone;
        row.insertCell(3).textContent = record.address;
        row.insertCell(4).textContent = record.dob;
        row.insertCell(5).textContent = record.visitDate;
        row.insertCell(6).textContent = record.appointment;
        const actionCell = row.insertCell(6);
        const editButton = document.createElement('button');
        editButton.textContent = 'Sửa';
        editButton.onclick = () => editRecord(records.indexOf(record));
        actionCell.appendChild(editButton);
    });
}

function saveToFile() {

    const confirmation = confirm("Bạn có chắc chắn muốn lưu dữ liệu đầu tháng đến hiện tại?");

    if(confirmation){
        const today = new Date();
        const dataStr = JSON.stringify(records, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DucHanh-${getFormattedDate()}.txt`;
        document.body.appendChild(a);
        if(isLastDayOfMonth(today)){
            a.click();
        }else{
            alert('Chỉ ngày cuối tháng mới được lưu file nh')
        }
       
        document.body.removeChild(a);

        // localStorage.clear();
        // location.reload();
    }
   
}
function saveToFileChange(){
    const confirmation = confirm("Bạn có chắc chắn muốn lưu dữ liệu và chuyển sang máy tính khác");

    if(confirmation){
        const today = new Date();
        const dataStr = JSON.stringify(records, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DucHanh-${getFormattedDate()}.txt`;
        document.body.appendChild(a);
        // if(isLastDayOfMonth(today)){
        //     a.click();
        // }else{
        //     alert('Chỉ ngày cuối tháng mới được lưu file nh')
        // }
        a.click();
        
       
        document.body.removeChild(a);
    }
}


function saveToFileDelete() {

    const confirmation = confirm("Bạn có chắc chắn muốn lưu dữ liệu và xóa hết dữ liệu hiện có");

    if(confirmation){
        const today = new Date();
        const dataStr = JSON.stringify(records, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DucHanh-${getFormattedDate()}.txt`;
        document.body.appendChild(a);
        // if(isLastDayOfMonth(today)){
        //     a.click();
        // }else{
        //     alert('Chỉ ngày cuối tháng mới được lưu file nh')
        // }
        a.click();
        
       
        document.body.removeChild(a);

        localStorage.clear();
        location.reload();
    }
   
}

function loadFromFile() {
    document.getElementById('fileInput').click();
}

function loadFromFileThang(){
    document.getElementById('fileInputThang').click();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        records = data;
        localStorage.setItem('dentalRecords', JSON.stringify(records));
        displayRecords();
    };
    reader.readAsText(file);
}

function handleFileUploadThang(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const datas = JSON.parse(e.target.result);
    
        const plans = datas.flatMap(data => data.plan);

        let totalCost = 0;
   let totalPaid = 0;
   let totalRemaining = 0;

   plans.forEach(plan => {
    if (plan.cost) totalCost += parseFloat(plan.cost);
    if (plan.paid) totalPaid += parseFloat(plan.paid);
    if (plan.remaining) totalRemaining += parseFloat(plan.remaining);
    });
    const dialog = document.getElementById('dialog');
    const totalsDiv = document.getElementById('totals');
    totalsDiv.innerHTML = `
        <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
        <p><strong>Total Paid:</strong> ${totalPaid.toFixed(2)}</p>
        <p><strong>Total Remaining:</strong> ${totalRemaining.toFixed(2)}</p>
    `;
    dialog.classList.add('active');
        
    };
    reader.readAsText(file);
}

function getFormattedDate() {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 nên cần cộng thêm 1
    const year = date.getFullYear();

    // Thêm số 0 vào trước nếu ngày hoặc tháng chỉ có 1 chữ số
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    return `${day}-${month}-${year}`;
}

function isLastDayOfMonth(date) {
    const testDate = new Date(date);
    const nextDay = new Date(testDate);
    nextDay.setDate(testDate.getDate() + 1);

    return nextDay.getDate() === 1;
}

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('treatmentTableBody');

    // Lắng nghe sự kiện 'input' cho tất cả các trường trong bảng
    tableBody.addEventListener('input', (event) => {
        const input = event.target;

        // Kiểm tra nếu sự kiện là từ các trường 'cost' hoặc 'paid'
        if (input.name === 'cost' || input.name === 'paid') {
            updateRemaining(input);
        }
    });
});

function updateRemaining(input) {
    const row = input.closest('tr'); // Tìm hàng chứa trường input
    const costInput = row.querySelector('input[name="cost"]');
    const paidInput = row.querySelector('input[name="paid"]');
    const remainingInput = row.querySelector('input[name="remaining"]');

    // Lấy giá trị của các trường 'cost' và 'paid'
    const cost = parseFloat(costInput.value) || 0;
    const paid = parseFloat(paidInput.value) || 0;

    // Tính toán giá trị còn lại và cập nhật trường 'remaining'
    remainingInput.value = cost - paid;
}


// script.js
document.addEventListener('DOMContentLoaded', () => {
    const showBoxButton = document.getElementById('showBoxButton');
    const infoBox = document.getElementById('infoBox');
    const closeButton = document.getElementById('closeButton');

    // Hiển thị hộp thoại khi nhấp vào nút
    showBoxButton.addEventListener('click', () => {
        infoBox.classList.remove('hidden');
    });

    // Ẩn hộp thoại khi nhấp vào nút đóng
    closeButton.addEventListener('click', () => {
        infoBox.classList.add('hidden');
    });

    // Ẩn hộp thoại khi nhấp ra ngoài hộp thoại
    window.addEventListener('click', (event) => {
        if (event.target === infoBox) {
            infoBox.classList.add('hidden');
        }
    });
});


function thongKeDoanhTheoThang(){

}

function closeDialog() {
    document.getElementById('dialog').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}





document.getElementById('exportButton').addEventListener('click', () => {
    const confirmation = confirm("Bạn có chắc chắn muốn thống kê doanh thu hiện tại?");

    if (confirmation) {
        const plans = records.flatMap(record => record.plan);
        console.log(plans)
     
        let totalCost = 0;
        let totalPaid = 0;
        let totalRemaining = 0;
     
        plans.forEach(plan => {
         if (plan.cost) totalCost += parseFloat(plan.cost);
         if (plan.paid) totalPaid += parseFloat(plan.paid);
         if (plan.remaining) totalRemaining += parseFloat(plan.remaining);
         });
         const dialog = document.getElementById('dialog');
         const overlay = document.getElementById('overlay');
         const totalsDiv = document.getElementById('totals');
         totalsDiv.innerHTML = `
             <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
             <p><strong>Total Paid:</strong> ${totalPaid.toFixed(2)}</p>
             <p><strong>Total Remaining:</strong> ${totalRemaining.toFixed(2)}</p>
         `;
         dialog.classList.add('active');
         overlay.classList.add('active');
    }

   

});

document.addEventListener('DOMContentLoaded', (event) => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('visitDate').value = today;
    const dateInputs = document.querySelectorAll('input[type="date"]');
            dateInputs.forEach(input => {
                input.value = today;
            });
});

// Khởi tạo hiển thị ban đầu
displayRecords();
