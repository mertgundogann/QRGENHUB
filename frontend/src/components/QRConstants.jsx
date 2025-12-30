export const qrTypes = [
  {
    label: "qr.type.url",
    value: "url",
    fields: [{ name: "qr.field.url", placeholder: "qr.placeholder.url" }]
  },
  {
    label: "qr.type.tel",
    value: "tel",
    fields: [{ name: "qr.field.phone", placeholder: "qr.placeholder.phone" }]
  },
  {
    label: "qr.type.wifi",
    value: "wifi",
    fields: [
      { name: "qr.field.ssid", placeholder: "qr.placeholder.ssid" },
      { name: "qr.field.password", placeholder: "qr.placeholder.password" },
      { name: "qr.field.encryption", placeholder: "qr.placeholder.encryption" }
    ]
  },
 
{
  label: "vCard",
  value: "vcard",
  fields: [
    { name: "qr.field.fullname", placeholder: "qr.placeholder.fullname" },
    { name: "qr.field.job", placeholder: "qr.placeholder.job" }, 
    { name: "qr.field.company", placeholder: "qr.placeholder.company" }, 
    { name: "qr.field.phone", placeholder: "qr.placeholder.phone" },
    { name: "qr.field.email", placeholder: "qr.placeholder.email" },
    { name: "qr.field.website", placeholder: "qr.placeholder.website" }, 
    { name: "qr.field.address", placeholder: "qr.placeholder.address" }, 
  ],
},
  {
    label: "qr.type.text",
    value: "text",
    fields: [{ name: "qr.field.text", placeholder: "qr.placeholder.text" }]
  },
  {
    label: "qr.type.sms",
    value: "sms",
    fields: [
      { name: "qr.field.phone", placeholder: "qr.placeholder.phone" },
      { name: "qr.field.message", placeholder: "qr.placeholder.message" }
    ]
  },
  {
    label: "qr.type.email",
    value: "email",
    fields: [
      { name: "qr.field.email", placeholder: "qr.placeholder.email" },
      { name: "qr.field.subject", placeholder: "qr.placeholder.subject" },
      { name: "qr.field.message", placeholder: "qr.placeholder.message" }
    ]
  }
];