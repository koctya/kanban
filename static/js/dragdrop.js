window.dragDropBoard = function () {
    function moveCard(cardId, targetColumnId) {
        const formData = new FormData();
        formData.append("card_id", cardId);
        formData.append("target_column_id", targetColumnId);

        return fetch(`/cards/${cardId}/move`, {
            method: "POST",
            body: formData,
            headers: {
                "HX-Request": "true",
                "HX-Trigger": "drop",
            },
        })
            .then((response) => response.text())
            .then((html) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const boardColumns = doc.querySelector(".columns");
                if (boardColumns) {
                    document.querySelector(".columns").replaceWith(boardColumns);
                }
            });
    }

    return {
        isAddCardModalOpen: false,
        activeColumnId: null,
        modalTitle: "",
        modalDetails: "",

        init() {
            this.attachDragHandlers();
        },

        openAddCardModal(columnId) {
            this.activeColumnId = columnId;
            this.modalTitle = "";
            this.modalDetails = "";
            this.isAddCardModalOpen = true;
            window.setTimeout(() => {
                const input = document.querySelector('.modal-card-form input[name="title"]');
                if (input) input.focus();
            }, 50);
        },

        closeAddCardModal() {
            this.isAddCardModalOpen = false;
        },

        attachDragHandlers() {
            document.querySelectorAll(".card").forEach((card) => {
                if (card.dataset.dragHandlersAttached) {
                    return;
                }

                card.dataset.dragHandlersAttached = "true";
                card.addEventListener("dragstart", (event) => {
                    const cardEl = event.currentTarget;
                    event.dataTransfer.setData("text/plain", cardEl.dataset.cardId);
                    event.dataTransfer.effectAllowed = "move";
                    cardEl.classList.add("dragging");
                });

                card.addEventListener("dragend", (event) => {
                    event.currentTarget.classList.remove("dragging");
                });
            });

            document.querySelectorAll(".card-list").forEach((col) => {
                if (col.dataset.dropHandlersAttached) {
                    return;
                }

                col.dataset.dropHandlersAttached = "true";
                col.addEventListener("dragover", (event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    col.classList.add("drag-over");
                });

                col.addEventListener("dragenter", (event) => {
                    event.preventDefault();
                    col.classList.add("drag-over");
                });

                col.addEventListener("dragleave", () => {
                    col.classList.remove("drag-over");
                });

                col.addEventListener("drop", (event) => {
                    event.preventDefault();
                    col.classList.remove("drag-over");
                    const cardId = event.dataTransfer.getData("text/plain");
                    const targetColumn = col.closest(".column");
                    if (!cardId || !targetColumn) {
                        return;
                    }
                    const targetColumnId = targetColumn.id.replace("column-", "");
                    moveCard(cardId, targetColumnId).then(() => this.attachDragHandlers());
                });
            });
        },
    };
};
