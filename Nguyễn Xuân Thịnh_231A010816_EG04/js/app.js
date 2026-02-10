

const movies = [
    { 
        id: 1, 
        title: "Inception", 
        year: 2010, 
        genres: ["Hành động", "Khoa học viễn tưởng"], 
        poster: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg", 
        desc: "Dom Cobb là một kẻ trộm bậc thầy, giỏi nhất trong nghệ thuật trích xuất nguy hiểm: lấy cắp những bí mật quý giá từ sâu trong tiềm thức.", 
    },
    { 
        id: 2, 
        title: "The Dark Knight", 
        year: 2008, 
        genres: ["Hành động", "Tội phạm"], 
        poster: "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg", 
        desc: "Batman phải đối mặt với một kẻ thù mới đầy hỗn loạn được gọi là Joker, kẻ đang gieo rắc kinh hoàng khắp thành phố Gotham.", 
    },
    { 
        id: 3, 
        title: "Interstellar", 
        year: 2014, 
        genres: ["Khoa học viễn tưởng", "Phiêu lưu"], 
        poster: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg", 
        desc: "Một nhóm các nhà thám hiểm du hành qua một lỗ hổng trong không gian để đảm bảo sự sống còn của nhân loại.", 
    },
    { 
        id: 4, 
        title: "Spiderman: Across the Spider-Verse", 
        year: 2023, 
        genres: ["Hành động", "Phiêu lưu"], 
        poster: "https://upload.wikimedia.org/wikipedia/vi/b/b4/Spider-Man-_Across_the_Spider-Verse_poster.jpg", 
        desc: "Miles Morales dấn thân vào một cuộc phiêu lưu xuyên qua đa vũ trụ, nơi anh gặp gỡ một đội ngũ Người Nhện khác.", 
    },
    { 
        id: 5, 
        title: "The Godfather", 
        year: 1972, 
        genres: ["Tội phạm"], 
        poster: "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg", 
        desc: "Câu chuyện về gia đình mafia quyền lực Corleone dưới sự lãnh đạo của 'Bố già' Vito Corleone.", 
    }
];
// 1. Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    renderMovies(movies);
    renderGenres();
    initTheme();
});

// 2. Hiển thị danh sách phim
function renderMovies(data) {
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = data.map(movie => `
        <div class="movie-card" onclick="openModal(${movie.id})">
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="movie-card-info">
                <h4>${movie.title}</h4>
                <p>${movie.year}</p>
            </div>
        </div>
    `).join('');
}

// 3. Tự động lấy thể loại và tạo Checkbox
function renderGenres() {
    const genres = [...new Set(movies.flatMap(m => m.genres))];
    const container = document.getElementById('genre-filters');
    container.innerHTML = genres.map(g => `
        <label><input type="checkbox" class="genre-checkbox" value="${g}"> ${g}</label><br>
    `).join('');

    // Lắng nghe sự kiện checkbox
    document.querySelectorAll('.genre-checkbox').forEach(cb => {
        cb.addEventListener('change', filterMovies);
    });
}

// 4. Logic Lọc tích hợp & Tìm kiếm
function filterMovies() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedGenres = Array.from(document.querySelectorAll('.genre-checkbox:checked')).map(cb => cb.value);

    const filtered = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
        const matchesGenre = selectedGenres.length === 0 || 
                             selectedGenres.every(g => movie.genres.includes(g));
        return matchesSearch && matchesGenre;
    });

    renderMovies(filtered);
}

// 5. Kỹ thuật Debounce cho tìm kiếm
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

const processSearch = debounce(() => filterMovies());
document.getElementById('search-input').addEventListener('input', processSearch);

// 6. Modal chi tiết
function openModal(id) {
    const movie = movies.find(m => m.id === id);
    const modal = document.getElementById('movie-modal');
    const body = document.getElementById('modal-body');

    body.innerHTML = `
        <div style="display: flex; gap: 20px;">
            <img src="${movie.poster}" style="width: 300px;">
            <div>
                <h2>${movie.title} (${movie.year})</h2>
                <p><strong>Thể loại:</strong> ${movie.genres.join(', ')}</p>
                <p>${movie.desc}</p>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

document.querySelector('.close-btn').onclick = () => {
    document.getElementById('movie-modal').style.display = 'none';
};

// 7. Chế độ Sáng/Tối
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
};

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}