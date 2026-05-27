# Low-Fidelity Prototype

The user starts on the Home screen:

![Home Screen](lofi-models/lofi-home.png)

Here they can choose whether to upload their own image or look for an existing meme template. We clarify these two options by using a split screen design.

When the "Browse template library" option is tapped/clicked, a pop-up of available templates is opened:
![Browse Templates Pop-Up](lofi-models/lofi-library.png)

- The first row is recently used templates.
- The following rows contain trending templates pulled from the Imgflip API.
- The "Upload my own image" option is displayed at the top, as opposed to "Browse template library" so that the pop-up does not remove the option from view.
- Note: the pop-up design operates on an assumption that there will be about 10 templates to choose from for now. If we want to have more templates, opening a separate page would be better. But if there are only a few templates to choose from, this can reduce the amount of steps to create a meme.

The Editor screen is reached from either tapping/clicking the "Upload my own image" option on the Home Screen or by selecting a template from the Browse pop-up:
![Editor Screen](lofi-models/lofi-editor.png)

- An option is provided to go back and select a different image.
- The image and textbox(es) are displayed towards the top, an easy-to-view location.
- Common editor functions are provided close to the image, including zoom in and out, undo, and redo. The buttons contain a text label and an icon to aid in recognition.
- Three dropdowns are provided:
  - Text: Here the text font, color, style, and size can be adjusted. An option for AI caption generation will be included here.
  - Filters: Options for color-adjusting the image itself.
  - Stickers: Potential inclusion of iMessages stickers in an iMessage version.
- A Reset button will remove captions and set the text, filters, and stickers options to the default values. This button is in red to indicate the potential risk of Resetting.
- An Export button will navigate to the Export and Share screen. This button is in blue to contrast with the Reset button.

After clicking Export, the Export and Share screen is reached:
![Export and Share Screen](lofi-models/lofi-export.png)

- An option is provided to go back and make edits to the meme.
- A preview of the final meme is displayed.
- The meme can be saved in various formats, with the default set to PNG.
- The meme can be sent through various apps.
