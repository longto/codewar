import java.util.*;
import java.util.stream.*;
import java.util.Arrays;

public class BreakEvilPieces {

  private static void draw(String[] render) {
    System.out.println(String.join("\n", render));
  }

  private static void view(char[][] screen) {
    for (int i = 0; i < screen.length; i++) {
      for (int j = 0; j < screen[i].length; j++)
        System.out.print(screen[i][j]);
      System.out.println();
    }
  }

  private static int[] bound(List<int[]> points) {
    int iMin = Integer.MAX_VALUE, jMin = Integer.MAX_VALUE, iMax = Integer.MIN_VALUE, jMax = Integer.MIN_VALUE;
    for (int[] p : points) {
      int i = p[0], j = p[1];
      iMin = Math.min(iMin, i);
      jMin = Math.min(jMin, j);
      iMax = Math.max(iMax, i);
      jMax = Math.max(jMax, j);
    }
    return new int[] { iMin, jMin, iMax, jMax };
  }

  private static String extract(List<int[]> points, char[][] render) {
    int[] b = bound(points);
    int iMin = b[0], jMin = b[1], iMax = b[2], jMax = b[3];
    char[][] screen = new char[iMax - iMin + 1][jMax - jMin + 1];
    for (int i = 0; i < screen.length; i++) {
      Arrays.fill(screen[i], ' ');
    }
    points.forEach(p -> {
      int i = p[0] - iMin, j = p[1] - jMin;
      screen[i][j] = render[i + iMin][j + jMin];
    });
    points.forEach(p -> {
      int i = p[0] - iMin, j = p[1] - jMin;
      if (screen[i][j] == '+') {
        if (0 < i && i + 1 < screen.length && "+|".indexOf(screen[i - 1][j]) >= 0 && "+|".indexOf(screen[i + 1][j]) >= 0
            && (0 == j || "+-".indexOf(screen[i][j - 1]) < 0)
            && (j + 1 == screen[i].length || "+-".indexOf(screen[i][j + 1]) < 0)) {
          screen[i][j] = '|';
        }
        if (0 < j && j + 1 < screen[i].length && "+-".indexOf(screen[i][j - 1]) >= 0
            && "+-".indexOf(screen[i][j + 1]) >= 0
            && (0 == i || j < screen[i - 1].length && "+|".indexOf(screen[i - 1][j]) < 0)
            && (i + 1 == screen.length || j < screen[i + 1].length && "+|".indexOf(screen[i + 1][j]) < 0)) {
          screen[i][j] = '-';
        }
      }
    });
    char[][] collapse = new char[screen.length / 2 + 1][screen[0].length / 2 + 1];
    for (int i = 0; i < collapse.length; i++) {
      Arrays.fill(collapse[i], ' ');
    }
    points.forEach(p -> {
      int i = p[0] - iMin, j = p[1] - jMin;
      if (i % 2 == 0 && j % 2 == 0) {
        collapse[i / 2][j / 2] = screen[i][j];
      }
    });
    view(screen);
    view(collapse);
    List<String> result = new ArrayList<>();
    for (int i = 0; i < collapse.length; i++) {
      String s = String.copyValueOf(collapse[i]).replaceAll("\\s+$", "");
      if (s.length() > 0)
        result.add(s);
    }
    return String.join("\n", result);
  }

  private static String arr2str(int[] arr) {
    return " " + Arrays.stream(arr).mapToObj(String::valueOf).collect(Collectors.joining(",")) + " ";
  }

  private static String lst2str(List<int[]> lst) {
    return String.join("", lst.stream().map(p -> arr2str(p)).collect(Collectors.toList()));
  }

  public static List<String> solve(String shape) {
    String[] sml = shape.split("\n");
    int n = sml.length, m = 0;
    int[][] go = { { -1, -1 }, { -1, 0 }, { -1, 1 }, { 0, -1 }, { 0, 1 }, { 1, -1 }, { 1, 0 }, { 1, 1 } };
    for (int i = 0; i < n; i++) {
      m = Math.max(m, sml[i].length());
    }
    if(n>30 || m>30) {
      System.out.println(shape.replaceAll("\n", "\\n"));
    }
    System.out.println("n=" + n + ", m=" + m);
    char[][] render = new char[2 * n][2 * m];
    for (int i = 0; i < render.length; i++) {
      Arrays.fill(render[i], ' ');
    }
    for (int i = 0; i < sml.length; i++) {
      for (int j = 0; j < sml[i].length(); j++) {
        render[2 * i][2 * j] = sml[i].charAt(j);
        if (0 < i && j < sml[i - 1].length() && "+|".indexOf(sml[i].charAt(j)) >= 0
            && "+|".indexOf(sml[i - 1].charAt(j)) >= 0) {
          render[2 * i - 1][2 * j] = '|';
        }
        if (0 < j && "+-".indexOf(sml[i].charAt(j)) >= 0 && "+-".indexOf(sml[i].charAt(j - 1)) >= 0) {
          render[2 * i][2 * j - 1] = '-';
        }
      }
    }
    draw(sml);
    view(render);
    int g = 0;
    int[] empty;
    List<Integer> groups = new ArrayList<>();
    Map<Integer, List<int[]>> borders = new HashMap<Integer, List<int[]>>();

    Queue<int[]> emptyQueue = new LinkedList<>();
    for (int i = 0; i < render.length; i++) {
      for (int j = 0; j < render[i].length; j++) {
        if (render[i][j] == ' ')
          emptyQueue.add(new int[] { i, j });
      }
    }

    while (emptyQueue.size() > 0) {
      empty = emptyQueue.remove();
      if (render[empty[0]][empty[1]] != ' ')
        continue;
      g++;
      Queue<int[]> q = new LinkedList<>(Arrays.asList(empty));
      boolean closeGroup = true;
      String visitedPoints = "";
      List<int[]> b = new ArrayList<int[]>();
      while (q.size() > 0) {
        int[] first = q.remove();
        int i = first[0], j = first[1];
        render[i][j] = '.';
        if (i == 0 || i == render.length - 1 || j == 0 || j == render[i].length - 1)
          closeGroup = false;
        for (int k = 0; k < go.length; k++) {
          int ii = i + go[k][0];
          int jj = j + go[k][1];
          if (0 > ii || ii >= render.length || 0 > jj || jj >= render[ii].length)
            continue;
          if (render[ii][jj] == ' ') {
            render[ii][jj] = '.';
            q.add(new int[] { ii, jj });
          } else if ("+-|".indexOf(render[ii][jj]) >= 0) {
            int[] newPoint = new int[] { ii, jj };
            String nps = arr2str(newPoint);
            if (visitedPoints.indexOf(nps) < 0)
              b.add(newPoint);
          }
        }
      }
      if (closeGroup) {
        groups.add(g);
        borders.put(g, b);
      }
    }
    view(render);
    List<String> result = new ArrayList<>();
    int count = 0;
    for (Map.Entry<Integer, List<int[]>> e1 : borders.entrySet()) {
      System.out.println("count = "+ count++);
      result.add(extract(e1.getValue(), render));
    }
    return result;
  }

  public static void main(String[] args) {
    // String shape = "+------------+\n| |\n| ++ |\n| ++ |\n| |\n+------++----+\n|
    // || |\n| || |\n+------++----+";
    //String shape = "+-+\n| |\n| +-----+  +-----+\n|       |  |     |\n|       +--+  +--+\n|             |\n|             +--+\n|                |\n+----------------+";
    //String shape = "+-----+\n|     +--+\n+----+   +---+\n     |       |\n     +---+ +-+\n         | |\n         | |\n         | |\n         +-+";
    //String shape = "+-------------------------+\n|                         |\n|     +-----+             |\n|     |     +--+          |\n|     +----+   +---+      |\n|          |       |      |\n|          +---+ +-+      |\n|              | |        |\n|              | |        |\n|              | |        |\n|              +-+        |\n|                         |\n+-------------------------+";
    String shape = "+--------+-+----------------+-+----------------+-+----------------+-+----------------+-+--------+\n|        +-+                +-+                +-+                | |                +-+        |\n|                                          +------+               | |                           |\n|                                          |+----+|               | +-----+                     |\n|                                          ||+--+||               |    +-+|                     |\n|       +----+             +----+          |||++|||               +-+  | ||                     |\n++      |+--+|  ++--+      |+--+|  ++--+   |||++|||      +-----+    +--+ |+--+                 ++\n||      ||++||  ||  |      ||++||  ||  |   |||+-+||      |     +--+      |   |                 ||\n++      ||++||  ++--+      ||++||  ++--+   ||+---+|      +----+   +---+  +---+                 ++\n|       |+--+|             |+--+|          |+-++--+           |       |                         |\n|       +----+             +----+      +---+--+|              +---+ +-+                         |\n|                                      +-------+                  | |                           |\n|                                                                 | |                           |\n|        +-+                +-+                +-+                | |                +-+        |\n|        | |                +-+                +-+                +-+                +-+        |\n|        ++++           +------+                              +------+           +------+       |\n|        ++++           |+----+|                              |+----+|           |+----+|       |\n|        ++++           ||+--+||                              ||+--+||           ||+--+||       |\n|        ++++           |||++|||                              |||++|||           |||++|||       |\n+-----------+      ++   |||++|||      ++                 ++   |||++|||      ++   |||++|||      ++\n| +--------+|      ||   |||+-+||      ||                 ||   |||+-+||      ||   |||+-+||      ||\n+-+   +---+||      ++   ||+---+|      ++                 ++   ||+---+|      ++   ||+---+|      ++\n|     |+-+|||           |+-++--+                              |+-++--+           |+-++--+       |\n|     || ++||       +---+--+|                             +---+--+|          +---+--+|          |\n|     |+---+|       +-------+                             +-------+          +-------+          |\n|     +-----+                                                                                   |\n|        +-+                +-+                +-+                +-+                +-+        |\n|        | |                | |                | |                +-+                +-+        |\n|        ++++               | |                | |            +------+                          |\n|        ++++         +-----+ |          +-----+ |            |+----+|                          |\n|        ++++         |+-+    |          |+-+    |            ||+--+||                          |\n|        ++++         || |  +-+          || |  +-+            |||++|||              +----+      |\n+-----------+      +--+| +--+    +-------+| +--+    +-----+   |||++|||      ++      |+--+|  ++--+\n| +--------+|      |   |      +--+        |      +--+     |   |||+-+||      ||      ||++||  ||  |\n+-+   +---+||      +---+  +---+   +-------+  +---+   +----+   ||+---+|      ++      ||++||  ++--+\n|     |+-+|||             |       |          |       |        |+-++--+              |+--+|      |\n|     || ++||             +-+ +---+          +-+ +---+    +---+--+|                 +----+      |\n|     |+---+|               | |                | |        +-------+                             |\n|     +-----+               | |                | |                                              |\n|        +-+                | |                | |                +-+                +-+        |\n+--------+-+----------------+-+----------------+-+----------------+-+----------------+-+--------+";
    solve(shape);
  }

}