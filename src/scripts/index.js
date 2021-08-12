var burger = document.querySelector(".hamburger")
var menu = document.querySelector(".burger-menu")
var item = document.querySelector(".burger-menu__item")
var link = document.querySelectorAll(".burger-menu__link")
var closemenu = document.querySelector(".burger-menu__close");

burger.addEventListener("click", function (e) {
  e.preventDefault()
});

burger.addEventListener("click", function (e) {
  menu.classList.add("open");
});

closemenu.addEventListener("click", function (e) {
  menu.classList.remove("open");
});

item.addEventListener("click", function (e) {
  menu.classList.remove("open");
});

const findBlockByAllias = (alias) => {
  return $(".review").filter((ndx, item) => {
    return $(item).attr("data-linked-with") == alias;
  });
};

$(".paginator__link").click((e) => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-open");
  const itemToShow = findBlockByAllias(target);
  const curItem = $this.closest(".paginator__item");

  itemToShow.addClass("review--active").siblings().removeClass("review--active");
  curItem.addClass("active").siblings().removeClass("active");
});



$(".team__item").on("click", function (event) {
  $(this).toggleClass("is_open").siblings().removeClass('is_open');
});

const slider = $('.products__slider').bxSlider({
  pager: false,
  controls: false
});

$('.left-scroll-button').click(e => {
  e.preventDefault();
  slider.goToPrevSlide();
})

$('.right-scroll-button').click(e => {
  e.preventDefault();
  slider.goToNextSlide();
});

const validateFields = (form, fieldsArray) => {
  fieldsArray.forEach((field) => {
    if (field.val().trim() == "") {
      field.addClass("input-error");
    } else {
      field.removeClass("input-error");
    }
  });
  const errorFields = form.find(".input-error");
  return errorFields.length == 0;
}
$(".form__content").submit(e => {
  e.preventDefault();
  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");
  const modal = $("#modal");
  const content = modal.find(".modal__message");
  modal.removeClass("error-modal");
  const isValid = validateFields(form, [name, phone, comment, to]);
  if (isValid) {
    const request = $.ajax({
      url: "https://webdev-api.loftschool.com/sendmail",
      method: "post",
      data: {
        name: name.val(),
        phone: phone.val(),
        comment: comment.val(),
        to: to.val()
      }
    });
    request.done((data) => {
      content.text(data.message);
      e.target.reset();
    });
    request.fail((data) => {
      const message = data.responseJSON.message;
      content.text(message);
      modal.addClass("error-modal");
    });
    request.always(() => {
      $('.modal').addClass("open");
    })
  }
});
$(".app-submit-button").on("click", function (event) {
  $('.modal').removeClass("open");
});

let player;
const playerContainer = $(".video-player");

let eventsInit = () => {
  $(".video-player__icon--start").click(e => {
    e.preventDefault();

    if (playerContainer.hasClass("paused")) {
      playerContainer.removeClass("paused");
      player.pauseVideo();
    } else {
      playerContainer.addClass("paused");
      player.playVideo();

    }
  });


  $(".video-player__lenght-scale").click(e => {
    const bar = $(e.currentTarget);
    const clickedPosition = e.originalEvent.layerX;
    const newButtonPositionPercent = (clickedPosition / bar.width()) * 100;
    const newPlayPositionSec = (player.getDuration() / 100) * newButtonPositionPercent;

    $(".video-player__circle").css({
      left: `${newButtonPositionPercent}%`
    });
    player.seekTo(newPlayPositionSec);
  });
};


$(".video-player__splash").click(e => {
  player.playVideo();
})


const onPlayerStateChange = event => {
  switch (event.data) {
    case 1:
      playerContainer.addClass("video-player--active");
      playerContainer.addClass("video-player--paused")
      break;

    case 2:
      playerContainer.removeClass("video-player--active");
      playerContainer.removeClass("video-player--paused")
      break;

  }
};
const formatTime = timeSec => {
  const roundTime = Math.round(timeSec);

  const minutes = addZero(Math.floor(roundTime / 60));
  const seconds = addZero(roundTime - minutes * 60);

  function addZero(num) {
    return num < 10 ? `0${num}` : num;
  }
  return `${minutes} : ${seconds}`;
};
const onPlayerReady = () => {
  let interval;
  const durationSec = player.getDuration();
  $(".video-player__duration-estimate").text(formatTime(durationSec));
  if (typeof interval !== "undefined") {
    clearInterval(interval);
  }
  interval = setInterval(() => {
    const completeSec = player.getCurrentTime();
    $(".video-player__duration-completed").text(formatTime(completeSec));
  }, 1000);
};


function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-video-player', {
    height: '405',
    width: '660',
    videoId: 'LXb3EKWsInQ',
    events: {
      onReady: onPlayerReady,
      // onStateChange: onPlayerStateChange
    },
    playerVars: {
      controls: 0,
      disablekb: 0,
      showinfo: 0,
      rel: 0,
      autoplay: 0,
      modestbranding: 0
    }
  });
}

eventsInit();

let myMap;

const init = () => {
  myMap = new ymaps.Map("map", {
    center: [55.76, 37.64],
    zoom: 12,
    controls: []
  });
  const coords = [
    [55.75, 37.50],
    [55.75, 37.71],
    [55.70, 37.70]
  ];
  var myCollection = new ymaps.GeoObjectCollection({}, {

    draggable: false,
    iconLayout: 'default#image',
    iconImageHref: "./img/marker.svg",
    iconImageSize: [30, 42],
    iconImageOffset: [-3, -42]
  });
  coords.forEach(coord => {
    myCollection.add(new ymaps.Placemark(coord));
  });
  myMap.geoObjects.add(myCollection);

  myMap.behaviors.disable('scrollZoom');
}

ymaps.ready(init);






const sections = $("section");
const display = $(".wrapper__content");
const sideMenu = $(".fixed-menu");
const menuItems = sideMenu.find(".fixed-menu__item");

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobile();


let inScroll = false;

sections.first().addClass("active-section");

const countSectionPosition = (sectionEq) => {
  const position = sectionEq * -100;

  if (isNaN(position)) {
    return 0;
  }

  return position;
};

const changeMenuThemeForSection = (sectionEq) => {
  const currentSection = sections.eq(sectionEq);
  const menuTheme = currentSection.attr("data-sidemenu-theme");
  const activeClass = "fixed-menu--shadowed";


  if (menuTheme === "black") {
    sideMenu.addClass(activeClass);
  } else {
    sideMenu.removeClass(activeClass);
  }
};

const resetActiveClassForItem = (items, itemEq, activeClass) => {
  items.eq(itemEq).addClass(activeClass).siblings().removeClass(activeClass);
}

const performTransition = (sectionEq) => {
  if (inScroll) return;

  const transitionOver = 1000;
  const mouseInertiaOver = 300;

  inScroll = true;

  const position = countSectionPosition(sectionEq);

  changeMenuThemeForSection(sectionEq);

  display.css({
    transform: `translateY(${position}%)`
  });

  resetActiveClassForItem(sections, sectionEq, "active-section");



  setTimeout(() => {
    inScroll = false;

    resetActiveClassForItem(menuItems, sectionEq, "active-section");
  }, transitionOver + mouseInertiaOver);


};


const viewportScroller = () => {
  const activeSection = sections.filter(".active-section");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  return {
    next() {
      if (nextSection.length) {
        performTransition(nextSection.index());
      }

    },
    prev() {
      if (prevSection.length) {
        performTransition(prevSection.index());
      }
    },
  };
};

$(window).on("wheel", (e) => {
  const deltaY = e.originalEvent.deltaY;
  const scroller = viewportScroller();

  if (deltaY > 0) {
    scroller.next();
  }
  if (deltaY < 0) {
    scroller.prev();
  }

});

$(window).on("keydown", (e) => {
  const tagName = e.target.tagName.toLowerCase();
  const userTypingInInputs = tagName === "input" || tagName === "textarea";
  const scroller = viewportScroller();

  if (userTypingInInputs) return;

  switch (e.keyCode) {
    case 38:
      scroller.prev();
      break;

    case 40:
      scroller.next();
      break;
  }

});

$(".wrapper").on("touchmove", e => e.preventDefault());

$("[data-scroll-to]").click(e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-scroll-to");
  const reqSection = $(`[data-section-id=${target}]`);

  performTransition(reqSection.index());
});
if (isMobile) {
  $("body").swipe({

    swipe: function (event, direction) {
      const scroller = viewportScroller();
      let scrollDirection = "";

      if (direction === "up") scrollDirection = "next";
      if (direction === "down") scrollDirection = "prev";

      scroller[scrollDirection]();
    },
  });
}

const verticalAcc = () => {
  const links = document.querySelectorAll(".menu-section__trigger");
  const body = document.querySelector('body');

  const calculateWidth = () => {
    const windowWidth = window.innerWidth;

    const MAX_WIDTH = 550;

    const linksWidth = links[0].offsetWidth;

    const reqWidth = windowWidth - (linksWidth * links.length);

    return reqWidth > MAX_WIDTH ? MAX_WIDTH : reqWidth;

  };

  function closeItem(activeElement) {
    const activeText = activeElement.querySelector(".menu-section__content");
    activeText.style.width = "0px";
    activeElement.classList.remove("active--item");
  }
  links.forEach(function (elem) {
    elem.addEventListener("click", function (e) {
      e.preventDefault();
      const link = e.target.closest(".menu-section__trigger");

      const active = document.querySelector(".menu-section__item.active--item");
      console.log(active)

      if (active) {
        closeItem(active);
      }

      if (!active || active.querySelector(".menu-section__trigger") !== link) {
        const current = link.closest(".menu-section__item");
        current.classList.add("active--item");
        const currentText = current.querySelector(".menu-section__content");
        if (body.offsetWidth > 480) {
          currentText.style.width = calculateWidth() + 'px';

        } else {
          currentText.style.width = '100%';
        }
      }
    });
  });

  document.addEventListener("click", e => {
    e.preventDefault();
    let activePerson = document.querySelector(".menu-section__item.active--item");
    const target = e.target;

    if (!target.closest(".menu-section__list") && activePerson) {
      closeItem(activePerson);
    }
    
  });
};

verticalAcc();