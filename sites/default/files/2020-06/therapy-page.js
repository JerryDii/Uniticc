

const cards = [
    {
        name: "Social Support",
        link: "",
        image: {
            src: "Therapy-page-assets/Images_6.jpg",
            alt: ''
        }
    },
    {
        name: "Awareness Training",
        link: "",
        image: {
            src: "Therapy-page-assets/Images_1.jpg",
            alt: ''
        }
    },
    {
        name: "Response Training",
        link: "",
        image: {
            src: "Therapy-page-assets/Images_2.jpg",
            alt: ''
        }
    },
    {
        name: "Therapy Augmentation",
        link: "",
        image: {
            src: "Therapy-page-assets/Images_3.jpg",
            alt: ''
        }
    },
    {
        name: "Meditation Training",
        link: "",
        image: {
            src: "Therapy-page-assets/Images_4.jpg",
            alt: ''
        }
    },
    {
        name: "Suppression Drill",
        link: "",
        image: {
            src: "Therapy-page-assets/Images_5.jpg",
            alt: ''
        }
    },
    {
        name: "Compile",
        link: "rollover-test.html",
        image: {
            src: "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png",
            alt: ''
        }
    },
    {
        name: "Dashboard",
        link: "dashboard.html",
        image: {
            src: "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png",
            alt: ''
        }
    },
];

const fragment = document.getElementById('card-template');

cards.forEach(card => {
    const instance = document.importNode(fragment.content, true);
    instance.querySelector('[data-name]').textContent = card.name;
    instance.querySelector('[data-link]').href = card.link;
    instance.querySelector('[data-image]').src = card.image.src;
    instance.querySelector('[data-image]').alt = card.image.alt;
    document.getElementById('main').appendChild(instance);
});
