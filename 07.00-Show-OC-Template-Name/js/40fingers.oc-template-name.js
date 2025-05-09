// Class to handle displaying Open Content template information in DNN Edit Mode
class OpenContentTemplateInfo {
    constructor({
        selCheckEditElement = '.dnnDragHint',      // Selector for elements indicating DNN edit mode
        selOcInfo = '[data-oc-info]',     // Selector for elements containing Open Content info
        prePend = 'OC: '                            // Prefix to prepend to the displayed info
    } = {}) {
        this.selCheckEditElement = selCheckEditElement;
        this.selOcInfo = selOcInfo;
        this.prePend = prePend;
        this.ocPolling = null;

        // Automatically start polling when the object is created
        this.startPoller();
    }

    // Starts an interval to check if DNN Edit Mode is active
    startPoller() {
        if (typeof dnn !== 'undefined' && dnn.ContentEditorManager) {
            // Polls every 250ms to check for edit hints
            this.ocPolling = setInterval(() => this.checkDnnState(), 250);
        } else {
            console.log('Not in Edit Mode or dnn.ContentEditorManager not available');
        }
    }

    // Stops the polling interval
    stopPoller() {
        if (this.ocPolling) {
            clearInterval(this.ocPolling);
            this.ocPolling = null;
        }
    }

    // Checks if elements indicating DNN Edit Mode are present
    checkDnnState() {
        const editHints = document.querySelectorAll(this.selCheckEditElement);
        if (editHints.length > 0) {
            // If found, stop polling and write Open Content info
            this.stopPoller();
            this.writeOpenContentInfo();
			console.log("write Template Names");
        }
    }

    // Updates each edit hint element with the related Open Content info
    writeOpenContentInfo() {
        const editHints = document.querySelectorAll(this.selCheckEditElement);

        editHints.forEach(hintEl => {
            const parent = hintEl.parentElement;
            if (!parent) return;

            // Find the element containing the Open Content template info
            const ocInfoEl = parent.querySelector(this.selOcInfo);
            if (!ocInfoEl) return;

            // Get the value of the data-oc-info attribute
            const oInfo = ocInfoEl.getAttribute('data-oc-info');
            if (oInfo) {
                // Display the info with the specified prefix
                hintEl.textContent = this.prePend + oInfo;
            } else {
                console.warn('Missing data-oc-info attribute for', ocInfoEl);
            }
        });
    }
}
