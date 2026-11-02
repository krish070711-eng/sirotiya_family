const nameInput = document.querySelector("#inviteeName");
const shareButton = document.querySelector("#shareInvitation");
const shareStatus = document.querySelector("#shareStatus");

function showPersonalizedInvitation(name) {
  const nameText = document.createElement("span");
  nameText.className = "invitee-line invitee-name";
  nameText.textContent = name;
  nameInput.replaceWith(nameText);
  shareButton.remove();
  shareStatus.remove();
}

const sharedName = new URLSearchParams(window.location.search).get("name")?.trim();

if (sharedName) {
  showPersonalizedInvitation(sharedName);
} else {
  nameInput.addEventListener("input", () => {
    shareButton.hidden = !nameInput.value.trim();
  });

  shareButton.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    if (!name) return;

    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set("name", name);
    const url = shareUrl.toString();

    shareStatus.replaceChildren();
    const link = document.createElement("a");
    link.href = url;
    link.textContent = "आमंत्रण लिंक देखें";
    shareStatus.append(link);

    if (window.location.protocol === "file:") {
      shareStatus.prepend(document.createTextNode("यह local link है; online hosting के बाद share करें: "));
    } else if (navigator.share) {
      try {
        await navigator.share({ title: "सवामणी आमंत्रण", url });
        shareStatus.prepend(document.createTextNode("लिंक शेयर कर दिया गया। "));
      } catch (error) {
        if (error.name !== "AbortError") {
          shareStatus.prepend(document.createTextNode("लिंक तैयार है: "));
        }
      }
    } else if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        shareStatus.prepend(document.createTextNode("लिंक कॉपी हो गया: "));
      } catch {
        shareStatus.prepend(document.createTextNode("यह लिंक शेयर करें: "));
      }
    } else {
      shareStatus.prepend(document.createTextNode("यह लिंक शेयर करें: "));
    }
  });
}