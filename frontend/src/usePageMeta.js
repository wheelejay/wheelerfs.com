import { useEffect } from 'react';

// Sets the browser tab title and meta description for the current page.
export default function usePageMeta({ title, description }) {
  useEffect(() => {
    document.title = title;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = description || '';
  }, [title, description]);
}
