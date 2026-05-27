window.addEventListener('DOMContentLoaded', async () => {
    let currentTourConfigFile = 'tour_config.json';
    const urlParams = new URLSearchParams(window.location.search);
    const museumId = urlParams.get('m');
    
    // --- KIỂM TRA HỆ THỐNG ĐỊA ĐIỂM (MỚI) ---
    // --- NẠP DỮ LIỆU ĐỊA ĐIỂM (MỚI) ---
    try {
        const resMuseums = await fetch('locations.json');
        const museums = await resMuseums.json();
        
        // Luôn tìm thông tin địa điểm dựa trên ID có trên URL
        const selectedId = museumId || (museums.length === 1 ? museums[0].id : null);
        
        if (selectedId) {
            const m = museums.find(item => item.id === selectedId);
            if (m) {
                document.getElementById('welcome-title').textContent = m.name;
                document.getElementById('welcome-desc').textContent = m.description;
                document.getElementById('welcome-enter-btn').href = `${m.url}?m=${m.id}`;
                
                // Đổi ảnh nền theo thumbnail của kho
                const bgElement = document.getElementById('welcome-bg');
                if (bgElement && m.thumbnail) {
                    bgElement.style.backgroundImage = `url('${m.thumbnail}')`;
                }

                document.title = m.name;
                currentTourConfigFile = `${m.id}_tour_config.json`;
            }
        }
    } catch (err) {
        console.warn("Nạp dữ liệu địa điểm thất bại, dùng mặc định.");
    }

    // --- NHẠC NỀN ---
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    let isMusicPlaying = false;

    music.volume = 0.3;

    function setMusicState(playing) {
        isMusicPlaying = playing;
        sessionStorage.setItem('bgMusicPlaying', playing ? '1' : '0');
        musicBtn.textContent = playing ? '🎵 Nhạc nền: BẬT' : '🎵 Nhạc nền: TẮT';
    }

    musicBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            music.pause();
            setMusicState(false);
        } else {
            music.play();
            setMusicState(true);
        }
    });

    // Khôi phục trạng thái từ sessionStorage (khi quay lại từ tour)
    if (sessionStorage.getItem('bgMusicPlaying') === '1') {
        music.play().then(() => setMusicState(true)).catch(() => {});
    }

    const guideContainer = document.getElementById('guide-container');
    const guideAudio = document.getElementById('guide-audio');
    const guideImg = document.getElementById('guide-gif');
    const toggleBtn = document.getElementById('toggle-guide-btn');

    let isGuideActive = false;

    // --- 1. TẢI HƯỚNG DẪN VIÊN (MỚI - CENTRALIZED) ---
    try {
        const resGuides = await fetch('guides_config.json');
        const guidesData = await resGuides.json();
        
        // Lấy ID hiện tại (mặc định là k91 nếu không có ID trên URL)
        const currentId = museumId || 'k91';
        const guideInfo = guidesData[currentId] ? guidesData[currentId].welcome : null;

        if (guideInfo) {
            if (guideInfo.audio) guideAudio.src = guideInfo.audio;
            if (guideInfo.image) guideImg.src = guideInfo.image;
        }
    } catch (err) {
        console.error("Lỗi nạp hướng dẫn viên ảo:", err);
    }

    // --- 2. CÁC HÀM XỬ LÝ ---
    function showGuide() {
        if (!isGuideActive) {
            guideContainer.classList.remove('hidden');
            guideAudio.play();
            toggleBtn.textContent = 'Tắt Hướng Dẫn';
            isGuideActive = true;
        }
    }

    function hideGuide() {
        guideContainer.classList.add('hidden');
        guideAudio.pause();
        guideAudio.currentTime = 0;
        toggleBtn.textContent = 'Bật Hướng Dẫn';
        isGuideActive = false;
    }

    guideAudio.addEventListener('ended', hideGuide);

    toggleBtn.addEventListener('click', () => {
        if (isGuideActive) hideGuide(); else showGuide();
    });
    
    // Tự động hiển thị và phát luôn
    setTimeout(() => {
        showGuide();
    }, 500); // Đợi nửa giây cho load UI
});