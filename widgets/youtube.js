/**
 * YouTube widget — the source's privacy-enhanced embed (`.embed-responsive-16by9`, source
 * L8314) inside `div.w-100.d-flex.pb-5.container-paragraph`. Authored as a link in default
 * content: `/widgets/youtube.html?id=<video id>`; the player loads youtube-nocookie.com.
 * @param {Element} widget The widget element (dataset.id = the video id)
 */
export default function decorate(widget) {
  const { id } = widget.dataset;
  const frame = widget.querySelector('.youtube-frame');
  if (!id || !frame || frame.querySelector('iframe')) return;
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
  iframe.title = 'YouTube video player';
  iframe.loading = 'lazy';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  frame.append(iframe);
}
