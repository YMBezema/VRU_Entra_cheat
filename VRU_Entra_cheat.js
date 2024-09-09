// ==UserScript==
// @name        ik ben te lui rollen activeren
// @namespace   Violentmonkey Scripts
// @match       https://entra.microsoft.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 27-8-2024 16:26:53
// ==/UserScript==

(function() {
    'use strict';

    // Store the index of the button to be clicked in localStorage
    let buttonIndex = parseInt(localStorage.getItem('buttonIndex') || '0', 10);

    // Function to wait for elements to appear in the DOM
    function waitForElements(selector, callback) {
        let checkInterval = setInterval(function() {
            let elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                clearInterval(checkInterval); // Stop checking
                callback(elements); // Proceed with the elements
            }
        }, 500); // Check every 500 milliseconds
    }

    // Function to wait until the button is clickable
    function waitForButtonToBeClickable(button, callback) {
        let checkInterval = setInterval(function() {
            if (button && !button.disabled && button.offsetParent !== null && !button.querySelector('.fxs-button-disabled ')) {
                clearInterval(checkInterval); // Stop checking
                callback(); // Proceed with the button click
            }
        }, 500); // Check every 500 milliseconds
    }

    // Wait until the DOM is fully loaded
    window.addEventListener('load', function() {
        if (buttonIndex >= 6) {
            localStorage.setItem('buttonIndex', '0');
            return;
        }

        waitForElements('.ext-aad-role-grid-activate-deactivate-btn.fxs-fxclick', function(buttons) {
            if (buttons[buttonIndex]) {
                buttons[buttonIndex].click();
                setTimeout(function() {
                    let dockingDiv = document.querySelector('.msportalfx-docking');
                    let activateButton = dockingDiv.querySelector('.ext-context-button.ext-role-activation-blade-activate-btn.fxc-base.fxc-simplebutton');
                    if (activateButton) {
                      setTimeout(function() {
                        waitForButtonToBeClickable(activateButton, function() {
                          let textFields = dockingDiv.querySelectorAll('input[type="text"], textarea');
                          textFields.forEach(function(field) {
                              field.value = 'esm';
                              field.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event to ensure value is recognized
                          });

                          activateButton.click();

                          buttonIndex++;
                          localStorage.setItem('buttonIndex', buttonIndex);

                          setTimeout(function() {
                              waitForElements('.fxs-toast-item.fxs-popup.fxs-portal-bg-txt-br.msportalfx-shadow-level4', function() { //needs to be more specific....
                                  location.reload();
                              });
                          }, 20000);
                        });
                      }, 3000);
                    }
                }, 2000);
            }
        });
    }, false);
})();