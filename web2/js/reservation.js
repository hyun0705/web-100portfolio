/**
 * VERTEX TOWER - Reservation Page
 */

document.addEventListener('DOMContentLoaded', () => {
    initTicketSelection();
    initReservationForm();
    initDatePicker();
});

/**
 * Initialize date picker with min date
 */
function initDatePicker() {
    const dateInput = document.getElementById('visitDate');
    if (dateInput) {
        // Set minimum date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];

        // Set maximum date to 3 months from now
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }
}

/**
 * Ticket card selection
 */
function initTicketSelection() {
    const ticketCards = document.querySelectorAll('.ticket-card');
    const ticketSelect = document.getElementById('ticketType');
    const featuredCard = document.querySelector('.ticket-card.featured');

    ticketCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected from all cards
            ticketCards.forEach(c => c.classList.remove('selected'));

            // Add selected to clicked card
            card.classList.add('selected');

            // Remove featured highlight if selecting different card
            if (featuredCard && card !== featuredCard) {
                featuredCard.classList.add('no-highlight');
            } else if (featuredCard) {
                featuredCard.classList.remove('no-highlight');
            }

            // Update hidden select
            const ticketValue = card.dataset.ticket;
            if (ticketSelect && ticketValue) {
                ticketSelect.value = ticketValue;
            }
        });
    });
}

/**
 * Reservation form handling
 */
function initReservationForm() {
    const form = document.getElementById('reservationForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Validate
            const adultCount = parseInt(data.adultCount) || 0;
            const youthCount = parseInt(data.youthCount) || 0;
            const childCount = parseInt(data.childCount) || 0;

            if (adultCount + youthCount + childCount === 0) {
                alert('최소 1명 이상 선택해 주세요.');
                return;
            }

            // Calculate total price
            const prices = {
                basic: { adult: 15000, youth: 12000, child: 10000 },
                combo: { adult: 25000, youth: 20000, child: 18000 },
                vip: { adult: 50000, youth: 45000, child: 40000 }
            };

            const ticketType = data.ticketType;
            if (!ticketType || !prices[ticketType]) {
                alert('티켓 종류를 선택해 주세요.');
                return;
            }

            const totalPrice =
                adultCount * prices[ticketType].adult +
                youthCount * prices[ticketType].youth +
                childCount * prices[ticketType].child;

            // Show confirmation
            const ticketNames = {
                basic: '전망대 입장권',
                combo: '전망대 + 스카이라운지',
                vip: 'VIP 패키지'
            };

            const confirmMessage = `
예약 정보를 확인해 주세요.

방문일: ${data.visitDate}
방문시간: ${data.visitTime}
티켓: ${ticketNames[ticketType]}
인원: 성인 ${adultCount}명, 청소년 ${youthCount}명, 어린이 ${childCount}명
총 금액: ${totalPrice.toLocaleString()}원

예약자: ${data.name}
연락처: ${data.phone}
이메일: ${data.email}

예약을 진행하시겠습니까?`;

            if (confirm(confirmMessage)) {
                alert('예약이 완료되었습니다.\n예약 확인서가 이메일로 발송됩니다.');
                form.reset();
                // Reset ticket selection
                document.querySelectorAll('.ticket-card').forEach(c => {
                    c.classList.remove('selected');
                    c.classList.remove('no-highlight');
                });
            }
        });
    }
}
