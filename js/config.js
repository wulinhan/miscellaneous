/* =========================================================================
   SANITY CONNECTION
   Fill in your Sanity projectId (from sanity.io/manage) to switch the site
   from its built-in demo catalog to your live CMS content. While projectId is
   empty, the site uses the bundled data and works exactly as before.
   ========================================================================= */
window.SANITY_CONFIG = {
  projectId: 'mkxfjwwf',
  dataset: 'production',
  apiVersion: '2023-10-01'
};

/* =========================================================================
   META PIXEL
   The dataset (pixel) id from Events Manager. Public by design: the pixel id
   ships in the page source on every site that runs one. The Conversions API
   access token is the secret half and lives only in the server env vars
   (META_CAPI_TOKEN), never here.
   ========================================================================= */
window.META_CONFIG = {
  pixelId: '2055464342020957'
};
