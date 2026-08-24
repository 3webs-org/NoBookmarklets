async function scanBookmarkTree(bookmark) {
  if (bookmark.children) bookmark.children.forEach(scanBookmarkTree);
  if (bookmark.unmodifiable) return;
  if (!bookmark.id) return;
  if (!bookmark.url) return;
  if (!bookmark.url.toLowerCase().startsWith("javascript:")) return;

  console.log("Deleting bookmarklet:", bookmark.title, bookmark.url);
  await chrome.bookmarks.remove(bookmark.id);
}

async function fullScan() {
  const tree = await chrome.bookmarks.getTree();
  tree.forEach(scanBookmarkTree);
}

chrome.runtime.onInstalled.addListener(fullScan);

chrome.runtime.onStartup.addListener(fullScan);

fullScan();

chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  scanBookmarkTree(bookmark);
});

chrome.bookmarks.onChanged.addListener(async (id, changeInfo) => {
  const bm = (await chrome.bookmarks.get([id]))[0];
  scanBookmarkTree(bm);
});
