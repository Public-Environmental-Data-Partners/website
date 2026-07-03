/** GROQ fragment for Sanity image fields — includes hotspot/crop for @sanity/image-url. */
export const SANITY_IMAGE_PROJECTION = `{
  alt,
  hotspot,
  crop,
  asset->{
    _id,
    url,
    metadata{
      dimensions{
        width,
        height
      }
    }
  }
}`
