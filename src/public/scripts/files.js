// ***** Start **** //

displayFiles();

// ***** Fetch and display users **** //

/**
 * Call api
 */
function displayFiles() {
  Http.get("/api/file/all")
    .then((resp) => resp.json())
    .then((resp) => {
      var allFiles = resp?.data;
      // Empty the anchor
      var allFilesAnchor = document.getElementById("all-files-anchor");
      allFilesAnchor.innerHTML = "";
      // Append users to anchor
      allFiles.forEach((user) => {
        allFilesAnchor.innerHTML += getFileDisplayEle(user);
      });
    });
}

/**
 * Get user display element
 */
function getFileDisplayEle(file) {
  return `<div class="file-display-ele" style="padding: 10px 0;">

      <div class="normal-view">
        <div>Name: ${file.fileName}</div>
        <div>Size: ${Number(file.fileSize / (1024 * 1024)).toFixed(2)} MB</div>
        <div>Category: ${file.category}</div>
        <div>
          <input type="email" value="" id="guest-user-email-input" />
          <button class="share-file-btn" id="share-file-btn" data-file-id="${
            file._id
          }">
            Share
          </button>
        </div>
        <button class="download-file-btn" id="download-file-btn" data-file-id="${
          file._id
        }">
          Download
        </button>
        <button class="delete-user-btn" id="delete-file-btn" data-file-id="${
          file._id
        }">
          Delete
        </button>
      </div>
    </div>`;
}

// **** Add, and Delete files **** //

// Setup event listener for button click
document.addEventListener(
  "click",
  function (event) {
    var ele = event.target;
    if (ele.matches("#upload-file-btn")) {
      event.preventDefault();
      uploadFile();
    } else if (ele.matches("#share-file-btn")) {
      event.preventDefault();
      shareFile(ele);
    } else if (ele.matches("#download-file-btn")) {
      event.preventDefault();
      downloadFile(ele);
    } else if (ele.matches("#delete-file-btn")) {
      event.preventDefault();
      deleteFile(ele);
    } else if (ele.matches("#logout-btn")) {
      event.preventDefault();
      logoutUser();
    }
  },
  false
);

/**
 * Upload a file
 */
function uploadFile() {
  const fileInput = document.getElementById("file-input");
  const file = fileInput?.files?.[0];
  const categoryInput = document.getElementById("name-input");
  const category = categoryInput.value;
  if (!file || !category) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  fileInput.files = null;
  fileInput.value = null;
  categoryInput.value = "";

  const data = {
    options: {
      method: "POST",
      credentials: "include",
      withCredentials: true,
      mode: "cors",
      body: formData
    }
  };
  // Call api
  Http.post("/api/file/upload", data).then(() => displayFiles());
}

/**
 * Share a file
 */
function shareFile(ele) {
  const guestUserEmailInput = document.getElementById("guest-user-email-input");
  if (!guestUserEmailInput?.value) return;

  const id = ele.getAttribute("data-file-id");
  Http.post("/api/file/share/" + id, {
    guestUserEmail: guestUserEmailInput.value
  }).then(() => (guestUserEmailInput.value = ""));
}

/**
 * Download a file
 */
function downloadFile(ele) {
  var id = ele.getAttribute("data-file-id");
  Http.get("/api/file/download/" + id).then(async (res) => {
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  });
}

/**
 * Delete a file
 */
function deleteFile(ele) {
  var id = ele.getAttribute("data-file-id");
  Http.delete("/api/file/remove/" + id).then(() => displayFiles());
}

// **** Logout **** //

function logoutUser() {
  Http.get("/api/auth/logout").then(() => (window.location.href = "/"));
}
