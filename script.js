// Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 50
    });

    // ===== MOBILE MENU =====
    function toggleMenu() {
        const navLinks = document.getElementById('navLinks');
        navLinks.classList.toggle('active');
    }

    function closeMenu() {
        const navLinks = document.getElementById('navLinks');
        navLinks.classList.remove('active');
    }

    // ===== WELCOME POPUP =====
    window.onload = function() {
        document.getElementById('welcomePopup').classList.remove('hidden');
    };

    function selectUserType(type) {
        document.getElementById('welcomePopup').classList.add('hidden');
        
        if (type === 'student') {
            // Student - show interested popup
            document.getElementById('interestedPopup').classList.add('active');
        } else if (type === 'faculty') {
            // Faculty - show registration popup
            showFacultyRegistrationPopup();
        } else if (type === 'institution') {
            // Institution - go to contact page
            showPage('contact');
        }
    }

    // ===== INTERESTED POPUP =====
    function closeInterestedPopup() {
        document.getElementById('interestedPopup').classList.remove('active');
    }

    function selectInterest(type) {
        closeInterestedPopup();
        
        if (type === 'tuition') {
            // Tuition Support - go to home page
            showPage('home');
        } else if (type === 'admission') {
            // Admission Assistance - go to admission page
            showPage('admission');
        }
    }

    // ===== PINCODE AUTO-FILL FUNCTION =====
    function fetchCityFromPincode() {
        const pincode = document.getElementById('reqPincode').value;
        const hintDiv = document.getElementById('pincodeHint');
        const cityInput = document.getElementById('reqCity');
        
        if (pincode.length === 6) {
            // Using India Post API for pincode lookup
            fetch(`https://api.postalpincode.in/pincode/${pincode}`)
                .then(response => response.json())
                .then(data => {
                    if (data[0].Status === 'Success') {
                        const city = data[0].PostOffice[0].District;
                        const state = data[0].PostOffice[0].State;
                        cityInput.value = city;
                        hintDiv.textContent = `City: ${city}, ${state}`;
                        hintDiv.classList.add('show');
                    } else {
                        hintDiv.textContent = 'Pincode not found. Please enter city manually.';
                        hintDiv.classList.add('show');
                        cityInput.readOnly = false;
                        cityInput.value = '';
                    }
                })
                .catch(error => {
                    console.log('API error, using fallback database');
                    // Fallback database
                    const pincodeDB = {
                        '110084': 'Delhi',
                        '400001': 'Mumbai',
                        '700001': 'Kolkata',
                        '600001': 'Chennai',
                        '500001': 'Hyderabad',
                        '560001': 'Bengaluru'
                    };
                    
                    if (pincodeDB[pincode]) {
                        cityInput.value = pincodeDB[pincode];
                        hintDiv.textContent = `City: ${pincodeDB[pincode]}`;
                        hintDiv.classList.add('show');
                    } else {
                        hintDiv.textContent = 'Pincode not found. Please enter city manually.';
                        hintDiv.classList.add('show');
                        cityInput.readOnly = false;
                        cityInput.value = '';
                    }
                });
        } else {
            hintDiv.classList.remove('show');
            cityInput.readOnly = false;
        }
    }

    // ===== EDUCATION LEVEL =====
    function selectEducationLevel(level) {
        document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        document.querySelectorAll('.class-options').forEach(opt => opt.classList.remove('active'));
        
        if (level === 'primary') {
            document.getElementById('primaryClasses').classList.add('active');
        } else if (level === 'secondary') {
            document.getElementById('secondaryClasses').classList.add('active');
        } else if (level === 'higher') {
            document.getElementById('higherClasses').classList.add('active');
        }
    }

    function selectClass(className) {
        document.querySelectorAll('.class-btn').forEach(btn => btn.classList.remove('selected'));
        event.target.classList.add('selected');
        document.getElementById('selectedClass').value = className;
    }

    // ===== STUDENT FLOW =====
    let selectedRequirement = 'home';

    function selectRequirement(type) {
        selectedRequirement = type;
        document.getElementById('reqHome').checked = (type === 'home');
        document.getElementById('reqGroup').checked = (type === 'group');
        document.getElementById('reqOnline').checked = (type === 'online');
    }

    function showStudentRequirementPopup() {
        document.getElementById('studentRequirementPopup').classList.add('active');
    }

    function closeStudentRequirementPopup() {
        document.getElementById('studentRequirementPopup').classList.remove('active');
    }

    function submitStudentRequirement(event) {
        event.preventDefault();
        
        const name = document.getElementById('reqName').value;
        const phone = document.getElementById('reqPhone').value;
        const address = document.getElementById('reqAddress').value;
        const locality = document.getElementById('reqLocality').value;
        const pincode = document.getElementById('reqPincode').value;
        const city = document.getElementById('reqCity').value;
        const selectedClass = document.getElementById('selectedClass').value;
        const board = document.getElementById('reqBoard').value;
        
        if (!name || !phone || !address || !locality || !pincode || !city || !selectedClass || !board) {
            alert('Please fill all fields');
            return false;
        }
        
        const formData = new FormData();
        formData.append('_subject', 'Student Requirement - Shiksha Support');
        formData.append('Name', name);
        formData.append('Phone', phone);
        formData.append('Address', address);
        formData.append('Locality', locality);
        formData.append('Pincode', pincode);
        formData.append('City', city);
        formData.append('Class', selectedClass);
        formData.append('Board', board);
        formData.append('Requirement Type', selectedRequirement);
        
        fetch('https://formsubmit.co/rubyjhaclass@gmail.com', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            closeStudentRequirementPopup();
            document.getElementById('studentSubjectsPopup').classList.add('active');
        })
        .catch(error => {
            closeStudentRequirementPopup();
            document.getElementById('studentSubjectsPopup').classList.add('active');
        });
        
        return false;
    }

    function closeStudentSubjectsPopup() {
        document.getElementById('studentSubjectsPopup').classList.remove('active');
    }

    function submitStudentSubjects(event) {
        event.preventDefault();
        
        const checkboxes = document.querySelectorAll('#studentSubjectsForm input[name="subjects[]"]:checked');
        const subjects = Array.from(checkboxes).map(cb => cb.value);
        
        if (subjects.length === 0) {
            alert('Please select at least one subject');
            return false;
        }
        
        const formData = new FormData();
        formData.append('_subject', 'Student Subjects Selection - Shiksha Support');
        formData.append('Subjects', subjects.join(', '));
        
        fetch('https://formsubmit.co/rubyjhaclass@gmail.com', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            alert('Thank you! Your requirement has been submitted successfully.');
            closeStudentSubjectsPopup();
        })
        .catch(error => {
            alert('Thank you! Your requirement has been submitted successfully.');
            closeStudentSubjectsPopup();
        });
        
        return false;
    }

    // ===== FACULTY FLOW =====
    function showFacultyRegistrationPopup() {
        document.getElementById('facultyRegistrationPopup').classList.add('active');
    }

    function closeFacultyRegistrationPopup() {
        document.getElementById('facultyRegistrationPopup').classList.remove('active');
    }

    function submitFacultyRegistration(event) {
        event.preventDefault();
        
        const name = document.getElementById('facultyName').value;
        const email = document.getElementById('facultyEmail').value;
        const phone = document.getElementById('facultyPhone').value;
        const qualification = document.getElementById('facultyQualification').value;
        const subject = document.getElementById('facultySubject').value;
        const experience = document.getElementById('facultyExperience').value;
        
        if (!name || !email || !phone || !qualification || !subject || !experience) {
            alert('Please fill all fields');
            return false;
        }
        
        const formData = new FormData();
        formData.append('_subject', 'New Faculty Registration - Shiksha Support');
        formData.append('Name', name);
        formData.append('Email', email);
        formData.append('Phone', phone);
        formData.append('Qualification', qualification);
        formData.append('Subject', subject);
        formData.append('Experience', experience);
        formData.append('Status', 'Registered');
        
        fetch('https://formsubmit.co/rubyjhaclass@gmail.com', {
            method: 'POST',
            body: formData
        });
        
        closeFacultyRegistrationPopup();
        document.getElementById('facultySuccessPopup').classList.add('active');
        
        return false;
    }

    function closeFacultySuccessPopup() {
        document.getElementById('facultySuccessPopup').classList.remove('active');
    }

    // ===== PAY FEES PAGE =====
    let selectedFeeAmount = 1000;

    function selectFee(course, amount) {
        selectedFeeAmount = amount;
        
        document.querySelectorAll('input[name="fee"]').forEach(radio => {
            radio.checked = false;
        });
        
        if (course === 'mathematics') document.getElementById('feeMath').checked = true;
        else if (course === 'science') document.getElementById('feeScience').checked = true;
        else if (course === 'physics') document.getElementById('feePhysics').checked = true;
        else if (course === 'chemistry') document.getElementById('feeChemistry').checked = true;
        else if (course === 'biology') document.getElementById('feeBiology').checked = true;
        else if (course === 'coding') document.getElementById('feeCoding').checked = true;
        
        document.getElementById('selectedAmount').textContent = `₹${amount.toLocaleString()}`;
        document.getElementById('payfeesQRSection').classList.add('active');
    }

    // ===== SLIDER =====
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const sliderWrapper = document.getElementById('sliderWrapper');
    const dotsContainer = document.getElementById('sliderDots');

    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlider() {
        sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    setInterval(nextSlide, 5000);

    // ===== PAGE NAVIGATION =====
    function showPage(page) {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active-section');
        });
        document.getElementById(page + '-page').classList.add('active-section');
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        
        const navLinks = document.querySelectorAll('.nav-links a');
        if (page === 'home') navLinks[0].classList.add('active');
        else if (page === 'about') navLinks[1].classList.add('active');
        else if (page === 'enquiry') navLinks[2].classList.add('active');
        else if (page === 'payfees') navLinks[3].classList.add('active');
        else if (page === 'contact') navLinks[4].classList.add('active');
        
        setTimeout(() => {
            AOS.refresh();
        }, 100);
        
        closeMenu();
    }

    // ===== FORM VALIDATIONS =====
    function validateEnquiry() {
        alert('Enquiry submitted! We will contact you soon.');
        return true;
    }

    function validateContact() {
        alert('Message sent! We will reply within 24 hours.');
        return true;
    }

    function validateAdmission() {
        alert('Admission assistance request submitted! We will contact you soon.');
        return true;
    }

    // Make functions global
    window.toggleMenu = toggleMenu;
    window.closeMenu = closeMenu;
    window.selectUserType = selectUserType;
    window.closeInterestedPopup = closeInterestedPopup;
    window.selectInterest = selectInterest;
    window.fetchCityFromPincode = fetchCityFromPincode;
    window.selectRequirement = selectRequirement;
    window.showStudentRequirementPopup = showStudentRequirementPopup;
    window.closeStudentRequirementPopup = closeStudentRequirementPopup;
    window.submitStudentRequirement = submitStudentRequirement;
    window.closeStudentSubjectsPopup = closeStudentSubjectsPopup;
    window.submitStudentSubjects = submitStudentSubjects;
    window.showFacultyRegistrationPopup = showFacultyRegistrationPopup;
    window.closeFacultyRegistrationPopup = closeFacultyRegistrationPopup;
    window.submitFacultyRegistration = submitFacultyRegistration;
    window.closeFacultySuccessPopup = closeFacultySuccessPopup;
    window.selectFee = selectFee;
    window.prevSlide = prevSlide;
    window.nextSlide = nextSlide;
    window.goToSlide = goToSlide;
    window.showPage = showPage;
    window.validateEnquiry = validateEnquiry;
    window.validateContact = validateContact;
    window.validateAdmission = validateAdmission;
    window.selectEducationLevel = selectEducationLevel;
    window.selectClass = selectClass;