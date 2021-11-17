async function scanBookmarkTree(bookmark) {
  if (bookmark.children) bookmark.children.forEach(scanBookmarkTree);
  if (bookmark.unmodifiable) return;
  if (!bookmark.id) return;
  if (!bookmark.url) return;
  if (!bookmark.url.toLowerCase().startsWith("javascript:")) return;
  await chrome.bookmarks.remove(bookmark.id);
}

chrome.runtime.onInstalled.addListener(async () => scanBookmarkTree(await chrome.bookmarks.getTree()));
chrome.bookmarks.onCreated.addListener(async id => scanBookmarkTree((await chrome.bookmarks.get([id]))[0]));
chrome.bookmarks.onChanged.addListener(async id => scanBookmarkTree((await chrome.bookmarks.get([id]))[0]));
