async function scanBookmarkTree(bookmark) {
  if (bookmark.children) bookmark.children.forEach(scanBookmarkTree);
  if (bookmark.unmodifiable) return;
  if (!bookmark.id) return;
  if (!bookmark.url) return;
  if (!bookmark.url.toLowerCase().startsWith("javascript:")) return;

  console.log("Deleting bookmarklet:", bookmark.title, bookmark.url);
  await chrome.bookmarks.remove(bookmark.id);
}
chrome.runtime.onInstalled.addListener(async () => {
  const tree = await chrome.bookmarks.getTree();
  tree.forEach(scanBookmarkTree);
});
chrome.runtime.onStartup.addListener(async () => {
  const tree = await chrome.bookmarks.getTree();
  tree.forEach(scanBookmarkTree);
});
chrome.bookmarks.onCreated.addListener(async id => {
  const bm = (await chrome.bookmarks.get([id]))[0];
  scanBookmarkTree(bm);
});
chrome.bookmarks.onChanged.addListener(async id => {
  const bm = (await chrome.bookmarks.get([id]))[0];
  scanBookmarkTree(bm);
});
chrome.management.onEnabled.addListener(async info => {
  if (info.id === chrome.runtime.id) {
    const tree = await chrome.bookmarks.getTree();
    tree.forEach(scanBookmarkTree);
  }
});
