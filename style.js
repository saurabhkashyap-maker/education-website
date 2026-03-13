
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
        populateClassOptions();
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

    // ===== CLASS OPTIONS POPULATION =====
    function populateClassOptions() {
        const classSelect = document.getElementById('classSelect');
        if (!classSelect) return;
        
        const primaryClasses = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];
        const secondaryClasses = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
        const higherClasses = ['Class 11', 'Class 12'];
        const ugClasses = ['UG 1st Year', 'UG 2nd Year', 'UG 3rd Year', 'UG 4th Year'];
        const pgClasses = ['PG 1st Year', 'PG 2nd Year'];
        
        const educationLevel = document.getElementById('educationLevel').value;
        
        let options = [];
        if (educationLevel === 'primary') options = primaryClasses;
        else if (educationLevel === 'secondary') options = secondaryClasses;
        else if (educationLevel === 'higher') options = higherClasses;
        else if (educationLevel === 'ug') options = ugClasses;
        else if (educationLevel === 'pg') options = pgClasses;
        
        classSelect.innerHTML = '';
        options.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls;
            option.textContent = cls;
            classSelect.appendChild(option);
        });
        
        if (educationLevel === 'other') {
            document.getElementById('classSelectionContainer').style.display = 'none';
            document.getElementById('otherClassContainer').style.display = 'block';
        } else {
            document.getElementById('classSelectionContainer').style.display = 'block';
            document.getElementById('otherClassContainer').style.display = 'none';
        }
    }

    function updateClassOptions() {
        populateClassOptions();
    }

    // ===== PINCODE AUTO-FILL =====
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
                    }
                })
                .catch(error => {
                    console.log('API error');
                });
        } else {
            hintDiv.classList.remove('show');
            cityInput.readOnly = false;
        }
    }

    // ===== OTHER SUBJECT HANDLER =====
    document.addEventListener('DOMContentLoaded', function() {
        const otherCheckbox = document.getElementById('otherSubjectCheckbox');
        if (otherCheckbox) {
            otherCheckbox.addEventListener('change', function() {
                const otherBox = document.getElementById('otherSubjectBox');
                if (this.checked) {
                    otherBox.classList.add('show');
                } else {
                    otherBox.classList.remove('show');
                }
            });
        }
    });

    // ===== PAY FEES PAGE FUNCTIONS =====
    function showPaymentForm(type) {
        // Hide all forms first
        document.getElementById('homeTuitionForm').classList.remove('active');
        document.getElementById('onlineClassesForm').classList.remove('active');
        document.getElementById('groupTuitionForm').classList.remove('active');
        
        // Hide all transaction sections
        document.getElementById('homeTransaction').classList.remove('active');
        document.getElementById('onlineTransaction').classList.remove('active');
        document.getElementById('groupTransaction').classList.remove('active');
        
        // Show selected form
        if (type === 'home') {
            document.getElementById('homeTuitionForm').classList.add('active');
        } else if (type === 'online') {
            document.getElementById('onlineClassesForm').classList.add('active');
        } else if (type === 'group') {
            document.getElementById('groupTuitionForm').classList.add('active');
        }
    }

    function submitPaymentForm(event, type) {
        event.preventDefault();
        
        // Get form data based on type
        let formData;
        if (type === 'home') {
            formData = new FormData(document.getElementById('homeTuitionPaymentForm'));
        } else if (type === 'online') {
            formData = new FormData(document.getElementById('onlineClassesPaymentForm'));
        } else if (type === 'group') {
            formData = new FormData(document.getElementById('groupTuitionPaymentForm'));
        }
        
        // Add payment type
        formData.append('Payment Type', type === 'home' ? 'Home Tuition' : type === 'online' ? 'Online Classes' : 'Group Tuition');
        
        // Send to FormSubmit
        fetch('https://formsubmit.co/rubyjhaclass@gmail.com', {
            method: 'POST',
            body: formData
        });
        
        // Show transaction section
        if (type === 'home') {
            document.getElementById('homeTransaction').classList.add('active');
        } else if (type === 'online') {
            document.getElementById('onlineTransaction').classList.add('active');
        } else if (type === 'group') {
            document.getElementById('groupTransaction').classList.add('active');
        }
        
        // Scroll to transaction section
        setTimeout(() => {
            document.getElementById(type + 'Transaction').scrollIntoView({ behavior: 'smooth' });
        }, 100);
        
        return false;
    }

    function submitTransaction(event, type) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Add payment type
        formData.append('Payment Type', type === 'home' ? 'Home Tuition' : type === 'online' ? 'Online Classes' : 'Group Tuition');
        
        // Send to FormSubmit
        fetch('https://formsubmit.co/rubyjhaclass@gmail.com', {
            method: 'POST',
            body: formData
        });
        
        alert('Transaction ID submitted successfully! We will verify your payment shortly.');
        
        // Hide transaction section
        if (type === 'home') {
            document.getElementById('homeTransaction').classList.remove('active');
        } else if (type === 'online') {
            document.getElementById('onlineTransaction').classList.remove('active');
        } else if (type === 'group') {
            document.getElementById('groupTransaction').classList.remove('active');
        }
        
        return false;
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
        const city = document.getElementById('reqCity').value;
        const locality = document.getElementById('reqLocality').value;
        const pincode = document.getElementById('reqPincode').value;
        const educationLevel = document.getElementById('educationLevel').value;
        let selectedClass = '';
        
        if (educationLevel === 'other') {
            selectedClass = document.getElementById('otherClass').value;
        } else {
            selectedClass = document.getElementById('classSelect').value;
        }
        
        const board = document.getElementById('reqBoard').value;
        
        if (!name || !phone || !city || !locality || !pincode || !selectedClass || !board) {
            alert('Please fill all fields');
            return false;
        }
        
        const formData = new FormData();
        formData.append('_subject', 'Student Requirement - Shiksha Support');
        formData.append('Name', name);
        formData.append('Phone', '+91' + phone);
        formData.append('City', city);
        formData.append('Locality', locality);
        formData.append('Pincode', pincode);
        formData.append('Education Level', educationLevel);
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
        let subjects = Array.from(checkboxes).map(cb => cb.value);
        
        const otherSubject = document.querySelector('#otherSubjectBox input')?.value;
        if (document.getElementById('otherSubjectCheckbox').checked && otherSubject) {
            subjects.push(otherSubject);
        }
        
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

    function showFacultyPaymentPopup() {
        document.getElementById('facultyPaymentPopup').classList.add('active');
    }

    function closeFacultyPaymentPopup() {
        document.getElementById('facultyPaymentPopup').classList.remove('active');
    }

    function submitFacultyRegistration(event) {
        event.preventDefault();
        
        const name = document.getElementById('facultyName').value;
        const city = document.getElementById('facultyCity').value;
        const location = document.getElementById('facultyLocation').value;
        const pincode = document.getElementById('facultyPincode').value;
        const mobile = document.getElementById('facultyMobile').value;
        const alternate = document.getElementById('facultyAlternate').value;
        const qualification = document.getElementById('facultyQualification').value;
        const subject = document.getElementById('facultySubject').value;
        const experience = document.getElementById('facultyExperience').value;
        
        if (!name || !city || !location || !pincode || !mobile || !qualification || !subject || !experience) {
            alert('Please fill all required fields');
            return false;
        }
        
        const formData = new FormData();
        formData.append('_subject', 'New Faculty Registration - Shiksha Support');
        formData.append('Name', name);
        formData.append('City', city);
        formData.append('Location', location);
        formData.append('Pin Code', pincode);
        formData.append('Mobile', '+91' + mobile);
        if (alternate) formData.append('Alternate', '+91' + alternate);
        formData.append('Qualification', qualification);
        formData.append('Subject', subject);
        formData.append('Experience', experience);
        formData.append('Status', 'Pending Payment');
        
        fetch('https://formsubmit.co/rubyjhaclass@gmail.com', {
            method: 'POST',
            body: formData
        });
        
        closeFacultyRegistrationPopup();
        showFacultyPaymentPopup();
        
        return false;
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
        else if (page === 'admission') navLinks[4].classList.add('active');
        else if (page === 'contact') navLinks[5].classList.add('active');
        
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

    function validateAdmission() {
        const consent = document.getElementById('consentCheckbox').checked;
        if (!consent) {
            alert('Please give your consent to proceed');
            return false;
        }
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
    window.showFacultyPaymentPopup = showFacultyPaymentPopup;
    window.closeFacultyPaymentPopup = closeFacultyPaymentPopup;
    window.submitFacultyRegistration = submitFacultyRegistration;
    window.showPaymentForm = showPaymentForm;
    window.submitPaymentForm = submitPaymentForm;
    window.submitTransaction = submitTransaction;
    window.prevSlide = prevSlide;
    window.nextSlide = nextSlide;
    window.goToSlide = goToSlide;
    window.showPage = showPage;
    window.validateEnquiry = validateEnquiry;
    window.validateAdmission = validateAdmission;
    window.updateClassOptions = updateClassOptions;
    window.populateClassOptions = populateClassOptions;

