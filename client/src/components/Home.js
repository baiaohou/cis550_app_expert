import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import PageNavbar from './PageNavbar';

function Sub() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Baiao Hou · Xuening Zhang · Zimao Wang · Han Li"}
    </Typography>
  );
}
const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    // backgroundColor: theme.palette.background.paper,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(6, 0, 3)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(5)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    //backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0)
  }
}));

const cards = [
  {
    header: "Search Your App 🔍",
    img:
      "../card-1.jpg",
    desc: "Description blah blah blah",
    goto: "/recommendations"
  },

  {
    header: "See Top Apps 🏅",
    img:
      "https://images.unsplash.com/photo-1564198879220-63f2734f7cec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2072&q=80",
    desc: "Description blah blah blah",
    goto: "/dashboard"
  },

  {
    header: "My Wishlist ✨",
    img:
      "../card-3.jpg",
    desc: "Description blah blah blah",
    goto: "/wishlist"
  }
];

export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


const first_name = getCookie("first_name");


export default function Home() {
  const classes = useStyles();

  return (
   
    <React.Fragment>
      <CssBaseline />
      <PageNavbar active="Home" />
    {/*    <AppBar position="relative">
         <Toolbar>
           <Typography variant="h6" color="inherit">
             🦧 AppExpert
           </Typography>
         </Toolbar>
       </AppBar> */}

      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h2"
              variant="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Welcome Back, {first_name}!
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Something short and leading about the collection below—its
              contents, the creator, etc. Make it short and sweet, but not too
              short so folks don&apos;t simply skip over it entirely.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" href="/Team">
                    About Our Team 🙋
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" href="/Login">
                    Sign Out 🔙
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>


        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={6}>
            {cards.map(card => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={card.img}
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      <a href={card.goto}>{card.header}</a>
                    </Typography>
                    <Typography>{card.desc}</Typography>
                  </CardContent>
                  <CardActions>
                    {/* <Button size="small" color="primary">
                      View
                    </Button> */}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>

      {/* Footer */}
      <footer className={classes.footer}>
        {/* <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography> */}
        <Typography
          variant="subtitle1"
          align="center"
          component="p"
        >
          CIS 550 Project — AppExpert
        </Typography>
        <Sub />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}