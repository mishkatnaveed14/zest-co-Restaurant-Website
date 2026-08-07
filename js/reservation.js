// RESERVATION FORM SECTION DATE DROPDOWN FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function () {
  const dateSelect = document.getElementById('reservation-date');
  if (!dateSelect) return;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const today = new Date();

  for (let i = 0; i < 4; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);

    const day = futureDate.getDate();
    const month = monthNames[futureDate.getMonth()];
    const year = futureDate.getFullYear();

    const displayText = `${day} ${month} ${year}`;

    const isoMonth = String(futureDate.getMonth() + 1).padStart(2, '0');
    const isoDay = String(day).padStart(2, '0');
    const valueText = `${year}-${isoMonth}-${isoDay}`;

    const option = document.createElement('option');
    option.value = valueText;
    option.textContent = displayText;

    if (i === 0) {
      option.selected = true;
    }

    dateSelect.appendChild(option);
  }
});