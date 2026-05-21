# Research: Imgflip API

## Imgflip API
The [Imgflip API](https://api.imgflip.com/) provides a RESTful interface to fetch popular meme templates and generate captioned images. 
* **Data Format:** Returns JSON responses.
* **Cost:** The base API is free and does not have a hard rate limit, though abuse will result in an IP/account ban.
* **Constraints:** Memes generated on the free tier will include a small "imgflip.com" watermark. 

## 1. Fetching Templates
Used to populate our app's initial gallery view with trending memes.

* **Endpoint:** `https://api.imgflip.com/get_memes`
* **Method:** `GET`
* **Authentication:** None required.

### Example Response
The API returns an array of the top 100 trending memes. The critical fields we need to extract are `id`, `name`, and `url`.
```json
{
   "success": true,
   "data": {
      "memes": [
         {
            "id": "61579",
            "name": "One Does Not Simply",
            "url": "https://i.imgflip.com/1bij.jpg",
            "width": 568,
            "height": 335,
            "box_count": 2
         },
         {
            "id": "101470",
            "name": "Ancient Aliens",
            "url": "https://i.imgflip.com/26am.jpg",
            "width": 500,
            "height": 437,
            "box_count": 2
         }
         // probably a lot more memes here..
      ]
   }
}
	
```
## 2. Generating a Caption

Used to send the user's custom text to Imgflip and receive the final image URL.

**Endpoint:** https://api.imgflip.com/caption_image

**Method:** POST

**Authentication:** Requires a valid Imgflip username and password.

Unlike most modern APIs, this endpoint DOES NOT accept raw JSON bodies. The request parameters must be sent as standard HTTP form data (application/x-www-form-urlencoded).

### Required Parameters
**template_id:** The ID obtained from the /get_memes endpoint.

**username:** Imgflip account username.

**password:** Imgflip account password.

**text0:** Top text string.

**text1:** Bottom text string.

### Example Response
If successful, the API returns the URL of the newly hosted image.
**Example Success Response:**
```json
{
   "success": true,
   "data": {
      "url": "https://i.imgflip.com/123abc.jpg",
      "page_url": "https://imgflip.com/i/123abc"
   }
}
```

**Example Failure Response:**
```json
{
   "success": false,
   "error_message": "Some hopefully-useful statement about why it failed"
}
```