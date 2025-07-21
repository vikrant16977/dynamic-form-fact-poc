namespace catalogservice;

entity Forms {
  key ID : Integer;
  title         : String;
  description   : String;
  schema        : LargeString;
  submissions : Association to many FormSubmissions on submissions.form_ID = $self;
}

entity FormSubmissions {
  key ID : Integer;
  form_ID       : Association to Forms;
  submission    : LargeString;
}
