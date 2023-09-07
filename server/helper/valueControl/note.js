class NewNote {
  constructor(text, html, images, accessibility) {
    this.text = text;
    this.html = html;
    this.images = images;
    this.accessibility = accessibility;
  }
  getForSave(userid) {
    let result = {
      text: this.text,
      html: this.html,
      userid
    }
    if (this.images) result.images = this.images;
    if (this.accessibility) result.accessibility = this.accessibility;
    return result;
  }
}

class EditNote {
  constructor(text, images, accessibility, link, html) {
    this.text = text;
    this.images = images;
    this.accessibility = accessibility;
    this.link = link;
    this.html = html;
  }
  validateInput = () => Boolean(this.link);
  getForUpdate(userid) {
    let result = {
      text: this.text,
      html: this.html,
      userid,
      link: this.link
    }
    if (this.images) result.images = this.images;
    if (this.accessibility) result.accessibility = this.accessibility;
    return result;
  }

}

module.exports = {
  NewNote, EditNote
}