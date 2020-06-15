import ClipboardJS from './clipboard.min.js';
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
// hi
(() => {
  // DOM
  const url_input = document.getElementById('url_input');
  const shortURLInput = document.getElementById('short_url');
  const alert = document.querySelector('.alert');
  const url_form = document.querySelector('#url_form');
  const submit_btn = document.getElementById('submit-btn');
  const copy_btn = document.querySelector('.copy-btn');
  const jsContainer = document.querySelector('.container');

  // Remove class when js is enabled
  jsContainer.classList.remove('hide');

  // Event handlers
  url_input.addEventListener('paste', handlePaste);
  url_input.addEventListener('keydown', handleDeleteText);
  url_input.addEventListener('click', selectAll);
  url_form.addEventListener('submit', handleSubmit);
  shortURLInput.addEventListener('click', selectAll);
  shortURLInput.addEventListener('keydown', event => event.preventDefault());

  // Adds hover button color if not on mobile
  const touchsupport =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
  if (!touchsupport) {
    copy_btn.className += ' non-touch';
  }

  // navigator.share is true if served over HTTPS and on chrome for android
  // This and the above code is to get some mobile friendliness.
  // Maybe put it in a function
  if (navigator.share) {
    copy_btn.addEventListener('click', () => {
      navigator
        .share({
          url: shortURLInput.value,
        })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error));
    });
    copy_btn.textContent = 'Share Link';
  } else {
    // Clipboardjs instantiate and success and error handlers
    const clipboard = new ClipboardJS('.copy-btn');
    clipboard.on('success', function (e) {
      // console.info('Action:', e.action);
      // console.info('Text:', e.text);
      // console.info('Trigger:', e.trigger);
      if (e.text) {
        addRemoveClass(alert, 'animate-reveal', 2000);
        addRemoveClass(shortURLInput, 'input-bg-info', 1000);
      }
      e.clearSelection(); // Not sure what this does
    });
    clipboard.on('error', function (e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const url = url_input.value;
    const linkObj = createLinkObj(url);

    if (linkObj.hostname === location.hostname) {
      shortURLInput.value = 'Nope!';
      addRemoveClass(shortURLInput, 'input-bg-error', 500);
    } else {
      getShortURL(url)
        .then(data => {
          const className = data.error ? 'input-bg-error' : 'input-bg-success';
          shortURLInput.value = data.short_url ? data.short_url : data.error;
          addRemoveClass(shortURLInput, className, 500);
          url_input.blur();
        })
        .catch(err => console.log(err));
    }
  }

  // Deletes text then pastes
  function handlePaste() {
    url_input.value = '';
    setTimeout(() => {
      submit_btn.click();
    });
  }

  function handleDeleteText(event) {
    if (
      event.key === 'Delete' ||
      event.key === 'Del' ||
      event.key === 'Backspace'
    ) {
      setTimeout(() => {
        if (!url_input.value) {
          shortURLInput.value = '';
        }
      });
    }
  }

  // Selects all text
  function selectAll() {
    if (this.value) {
      this.setSelectionRange(0, this.value.length);
    }
  }

  // POST is cool!
  function getShortURL(url) {
    const api = location.href + 'new';

    return fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url }),
    })
      .then(response => response.json())
      .catch(error => console.log(error));
  }

  function addRemoveClass(element, className, removeTime) {
    element.classList.add(className);
    setTimeout(() => {
      element.classList.remove(className);
    }, removeTime);
  }

  // Takes a url string
  function createLinkObj(input) {
    const a = document.createElement('a');
    a.setAttribute('href', input);
    return {
      baseURL: a.baseURI,
      host: a.host,
      hostname: a.hostname,
      href: a.href,
      origin: a.origin,
      protocol: a.protocol,
    };
  }
})();
