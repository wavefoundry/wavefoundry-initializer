import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FieldProps, Field } from "formik";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `${theme.spacing(2)}px 0 ${theme.spacing(1)}px 0`,
  },
  errorMessage: {
    paddingLeft: theme.spacing(2),
  },
}));

const FormRichTextField: React.FC<{
  name: string;
  label: string;
  toolbarOptions?: string[];
}> = ({ name, label, toolbarOptions = [] }) => {
  const classes = useStyles();
  const editorConfig = {
    toolbar: ["bold", "link", ...toolbarOptions],
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
      ],
    },
  };
  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => {
        return (
          <div className={classes.root}>
            <Typography color="textSecondary" gutterBottom>
              {label}
            </Typography>
            <CKEditor
              editor={ClassicEditor}
              data={field.value}
              onChange={(event: any, editor: any) => {
                form.setFieldValue(field.name, editor.getData());
              }}
              onBlur={() => form.setFieldTouched(field.name, true)}
              config={editorConfig}
            />
            {meta.touched && meta.error && (
              <Typography
                variant="caption"
                className={classes.errorMessage}
                color="error"
              >
                {meta.error}
              </Typography>
            )}
          </div>
        );
      }}
    </Field>
  );
};

export default FormRichTextField;
