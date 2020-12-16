import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
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
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(9, 0, 8)
  },
  heroButtons: {
    marginTop: theme.spacing(5)
  },
  cardGrid: {
    paddingTop: theme.spacing(7),
    paddingBottom: theme.spacing(3)
  },
  card: {
    height: "100%", 
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%"
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    padding: theme.spacing(4)
  }
}));

const cards = [

  {
    header: "Categories 🏆",
    img:
      "https://images.unsplash.com/photo-1564198879220-63f2734f7cec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2072&q=80",
    desc: "Explore Top Apps By Categories",
    goto: "/dashboard"
  },

  {
    header: "My Wishlist 🛒",
    img:
      "../card-3.jpg",
    desc: "See Your Favorite Picks",
    goto: "/wishlist"
  },

  {
    header: "Community 👭",
    img:
      "../card-5.jpg",
    desc: "Meet Friends & Get Their Tastes",
    goto: "/following"
  },
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

var first_name = getCookie("first_name")
first_name = first_name.substr(0, first_name.indexOf(" "));


export default function Home() {
  const classes = useStyles();

  return (
   
    <React.Fragment>
      <CssBaseline />
      <PageNavbar active="Home" />

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
              Nobody Knows Apps Better Than Us
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" href="/Recommended">
                    recommended for you 🙋
                  </Button>
                </Grid>
                &nbsp;
                <Grid item>
                  <Button variant="outlined" color="primary" href="/GoogleLogout" >
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
                    title="😉 What are you looking for?"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      <a href={card.goto}>{card.header}</a>
                    </Typography>
                    <Typography>{card.desc}</Typography>
                  </CardContent>
                  <CardActions>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>

      {/* Footer */}
      <footer className={classes.footer}>
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